from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, timedelta
from app.database import get_db
from app.models.subscription import Subscription
from app.models.plan import Plan
from app.models.user import User
from app.schemas.subscription import (
    SubscriptionCreate,
    SubscriptionUpdate,
    SubscriptionClose,
    SubscriptionOut
)
from app.services.subscription_service import (
    create_subscription,
    update_subscription_status,
    get_due_for_billing,
    calculate_next_billing_date
)
from app.core.security import get_current_user

router = APIRouter(prefix="/api/subscriptions", tags=["Subscriptions"])

@router.get("", response_model=List[SubscriptionOut])
def list_subscriptions(
    status: Optional[str] = Query(None),
    customer_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Subscription)
    
    if current_user.role == "customer":
        from app.models.customer import Customer
        cust = db.query(Customer).filter(Customer.email == current_user.email).first()
        if cust:
            query = query.filter(Subscription.customer_id == cust.id)
        else:
            return []
    else:
        if customer_id:
            query = query.filter(Subscription.customer_id == customer_id)
        if status and status != "all":
            query = query.filter(Subscription.status == status.lower())
        if search:
            query = query.filter(
                (Subscription.subscription_number.ilike(f"%{search}%")) |
                (Subscription.customer.has(name=search))
            )
            
    return query.order_by(Subscription.created_at.desc()).all()

@router.get("/due-for-billing", response_model=List[SubscriptionOut])
def list_due_for_billing(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_due_for_billing(db)

@router.post("", response_model=SubscriptionOut)
def create_new_subscription(
    req: SubscriptionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    data = req.model_dump()
    return create_subscription(db, data)

@router.get("/{sub_id}", response_model=SubscriptionOut)
def get_subscription(sub_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    sub = db.query(Subscription).filter(Subscription.id == sub_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    if current_user.role == "customer" and sub.customer.email != current_user.email:
        raise HTTPException(status_code=403, detail="Access denied")
    return sub

@router.put("/{sub_id}", response_model=SubscriptionOut)
def update_subscription(
    sub_id: int,
    req: SubscriptionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sub = db.query(Subscription).filter(Subscription.id == sub_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
        
    if req.quantity is not None:
        sub.quantity = req.quantity
    if req.unit_price is not None:
        sub.unit_price = req.unit_price
    if req.discount_amount is not None:
        sub.discount_amount = req.discount_amount
    if req.tax_amount is not None:
        sub.tax_amount = req.tax_amount
    if req.status is not None:
        sub.status = req.status
    if req.start_date is not None:
        sub.start_date = req.start_date
    if req.end_date is not None:
        sub.end_date = req.end_date
    if req.next_billing_date is not None:
        sub.next_billing_date = req.next_billing_date
    if req.close_reason is not None:
        sub.close_reason = req.close_reason
        
    subtotal = sub.unit_price * sub.quantity
    sub.total_amount = max(0.0, subtotal - sub.discount_amount + sub.tax_amount)
    db.commit()
    db.refresh(sub)
    return sub

@router.post("/{sub_id}/confirm", response_model=SubscriptionOut)
def confirm_sub(sub_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return update_subscription_status(db, sub_id, "confirmed")

@router.post("/{sub_id}/activate", response_model=SubscriptionOut)
def activate_sub(sub_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return update_subscription_status(db, sub_id, "active")

@router.post("/{sub_id}/pause", response_model=SubscriptionOut)
def pause_sub(sub_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return update_subscription_status(db, sub_id, "paused")

@router.post("/{sub_id}/resume", response_model=SubscriptionOut)
def resume_sub(sub_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return update_subscription_status(db, sub_id, "active")

@router.post("/{sub_id}/renew", response_model=SubscriptionOut)
def renew_sub(sub_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    sub = db.query(Subscription).filter(Subscription.id == sub_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
        
    plan = db.query(Plan).filter(Plan.id == sub.plan_id).first()
    freq = plan.billing_frequency if plan else "monthly"
    base_date = sub.end_date or date.today()
    sub.end_date = calculate_next_billing_date(base_date, freq)
    sub.next_billing_date = calculate_next_billing_date(date.today(), freq)
    sub.status = "active"
    db.commit()
    db.refresh(sub)
    return sub

@router.post("/{sub_id}/close", response_model=SubscriptionOut)
def close_sub(
    sub_id: int,
    req: SubscriptionClose,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return update_subscription_status(db, sub_id, "closed", close_reason=req.close_reason)
