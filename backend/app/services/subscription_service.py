from datetime import date, timedelta, datetime
from sqlalchemy.orm import Session
from app.models.subscription import Subscription
from app.models.plan import Plan

def generate_subscription_number(db: Session) -> str:
    count = db.query(Subscription).count() + 1
    return f"SUB-2026-{count:03d}"

def calculate_next_billing_date(start_date: date, frequency: str) -> date:
    frequency = (frequency or "monthly").lower()
    if frequency == "daily":
        return start_date + timedelta(days=1)
    elif frequency == "weekly":
        return start_date + timedelta(days=7)
    elif frequency == "yearly":
        try:
            return start_date.replace(year=start_date.year + 1)
        except ValueError:
            return start_date + timedelta(days=365)
    else:  # monthly
        year = start_date.year + (start_date.month // 12)
        month = (start_date.month % 12) + 1
        day = min(start_date.day, 28)
        return date(year, month, day)

def create_subscription(db: Session, data: dict) -> Subscription:
    subscription_number = generate_subscription_number(db)
    subtotal = data.get("unit_price", 0.0) * data.get("quantity", 1)
    total = max(0.0, subtotal - data.get("discount_amount", 0.0) + data.get("tax_amount", 0.0))
    
    start_date = data.get("start_date") or date.today()
    next_billing_date = data.get("next_billing_date")
    if not next_billing_date:
        plan = db.query(Plan).filter(Plan.id == data.get("plan_id")).first()
        freq = plan.billing_frequency if plan else "monthly"
        next_billing_date = calculate_next_billing_date(start_date, freq)
        
    subscription = Subscription(
        subscription_number=subscription_number,
        customer_id=data["customer_id"],
        plan_id=data["plan_id"],
        quotation_id=data.get("quotation_id"),
        quantity=data.get("quantity", 1),
        unit_price=data.get("unit_price", 0.0),
        discount_amount=data.get("discount_amount", 0.0),
        tax_amount=data.get("tax_amount", 0.0),
        total_amount=total,
        status=data.get("status", "draft"),
        start_date=start_date,
        end_date=data.get("end_date"),
        next_billing_date=next_billing_date
    )
    db.add(subscription)
    db.commit()
    db.refresh(subscription)
    return subscription

def update_subscription_status(db: Session, sub_id: int, new_status: str, close_reason: str = None) -> Subscription:
    sub = db.query(Subscription).filter(Subscription.id == sub_id).first()
    if not sub:
        raise ValueError("Subscription not found")
        
    sub.status = new_status
    sub.updated_at = datetime.utcnow()
    
    if new_status == "active" and not sub.start_date:
        sub.start_date = date.today()
        plan = db.query(Plan).filter(Plan.id == sub.plan_id).first()
        sub.next_billing_date = calculate_next_billing_date(sub.start_date, plan.billing_frequency if plan else "monthly")
    elif new_status == "paused":
        sub.paused_at = datetime.utcnow()
    elif new_status == "active" and sub.paused_at:
        sub.paused_at = None
    elif new_status == "closed":
        sub.closed_at = datetime.utcnow()
        sub.close_reason = close_reason

    db.commit()
    db.refresh(sub)
    return sub

def get_due_for_billing(db: Session):
    today = date.today()
    return db.query(Subscription).filter(
        Subscription.status == "active",
        Subscription.next_billing_date <= today
    ).all()
