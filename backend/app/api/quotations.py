from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.database import get_db
from app.models.quotation import Quotation
from app.models.user import User
from app.schemas.quotation import QuotationCreate, QuotationUpdate, QuotationOut
from app.schemas.subscription import SubscriptionOut
from app.services.quotation_service import create_quotation, confirm_quotation
from app.core.security import get_current_user

router = APIRouter(prefix="/api/quotations", tags=["Quotations"])

@router.get("", response_model=List[QuotationOut])
def list_quotations(
    status: Optional[str] = Query(None),
    customer_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Quotation)
    if status and status != "all":
        query = query.filter(Quotation.status == status.lower())
    if customer_id:
        query = query.filter(Quotation.customer_id == customer_id)
    if search:
        query = query.filter(
            (Quotation.quotation_number.ilike(f"%{search}%")) |
            (Quotation.customer.has(name=search))
        )
    return query.order_by(Quotation.created_at.desc()).all()

@router.post("", response_model=QuotationOut)
def create_new_quotation(
    req: QuotationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_quotation(db, req, created_by=current_user.id)

@router.get("/{quotation_id}", response_model=QuotationOut)
def get_quotation(quotation_id: int, db: Session = Depends(get_db)):
    quotation = db.query(Quotation).filter(Quotation.id == quotation_id).first()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    return quotation

@router.put("/{quotation_id}", response_model=QuotationOut)
def update_quotation(
    quotation_id: int,
    req: QuotationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    quotation = db.query(Quotation).filter(Quotation.id == quotation_id).first()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    if quotation.status not in ["draft", "sent"]:
        raise HTTPException(status_code=400, detail="Cannot edit quotation that is already processed")
        
    if req.customer_id is not None:
        quotation.customer_id = req.customer_id
    if req.plan_id is not None:
        quotation.plan_id = req.plan_id
    if req.product_id is not None:
        quotation.product_id = req.product_id
    if req.quantity is not None:
        quotation.quantity = req.quantity
    if req.unit_price is not None:
        quotation.unit_price = req.unit_price
    if req.discount_amount is not None:
        quotation.discount_amount = req.discount_amount
    if req.tax_amount is not None:
        quotation.tax_amount = req.tax_amount
    if req.status is not None:
        quotation.status = req.status
    if req.valid_until is not None:
        quotation.valid_until = req.valid_until
    if req.notes is not None:
        quotation.notes = req.notes
        
    subtotal = quotation.unit_price * quotation.quantity
    quotation.total_amount = max(0.0, subtotal - quotation.discount_amount + quotation.tax_amount)
    quotation.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(quotation)
    return quotation

@router.delete("/{quotation_id}")
def cancel_quotation(quotation_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    quotation = db.query(Quotation).filter(Quotation.id == quotation_id).first()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    quotation.status = "cancelled"
    quotation.updated_at = datetime.utcnow()
    db.commit()
    return {"message": "Quotation cancelled"}

@router.post("/{quotation_id}/confirm", response_model=SubscriptionOut)
def confirm_and_create_sub(
    quotation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return confirm_quotation(db, quotation_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
