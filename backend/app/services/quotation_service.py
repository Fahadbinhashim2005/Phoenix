from datetime import date, timedelta, datetime
from sqlalchemy.orm import Session
from app.models.quotation import Quotation
from app.models.subscription import Subscription
from app.models.plan import Plan
from app.schemas.quotation import QuotationCreate

def generate_quotation_number(db: Session) -> str:
    count = db.query(Quotation).count() + 1
    return f"QT-2026-{count:03d}"

def calculate_quotation_total(unit_price: float, quantity: int, discount_amount: float, tax_amount: float) -> float:
    subtotal = unit_price * quantity
    total = subtotal - discount_amount + tax_amount
    return max(0.0, total)

def create_quotation(db: Session, data: QuotationCreate, created_by: int = None) -> Quotation:
    quotation_number = generate_quotation_number(db)
    subtotal = data.unit_price * data.quantity
    total = max(0.0, subtotal - data.discount_amount + data.tax_amount)
    
    valid_until = data.valid_until or (date.today() + timedelta(days=30))
    
    quotation = Quotation(
        quotation_number=quotation_number,
        customer_id=data.customer_id,
        plan_id=data.plan_id,
        product_id=data.product_id,
        quantity=data.quantity,
        unit_price=data.unit_price,
        discount_amount=data.discount_amount,
        tax_amount=data.tax_amount,
        total_amount=total,
        status="draft",
        valid_until=valid_until,
        notes=data.notes,
        created_by=created_by
    )
    db.add(quotation)
    db.commit()
    db.refresh(quotation)
    return quotation

def confirm_quotation(db: Session, quotation_id: int) -> Subscription:
    from app.services.subscription_service import create_subscription, calculate_next_billing_date
    
    quotation = db.query(Quotation).filter(Quotation.id == quotation_id).first()
    if not quotation:
        raise ValueError("Quotation not found")
        
    quotation.status = "accepted"
    quotation.updated_at = datetime.utcnow()
    
    plan = db.query(Plan).filter(Plan.id == quotation.plan_id).first()
    freq = plan.billing_frequency if plan else "monthly"
    start_date = date.today()
    next_billing_date = calculate_next_billing_date(start_date, freq)
    
    sub = create_subscription(db, {
        "customer_id": quotation.customer_id,
        "plan_id": quotation.plan_id,
        "quotation_id": quotation.id,
        "quantity": quotation.quantity,
        "unit_price": quotation.unit_price,
        "discount_amount": quotation.discount_amount,
        "tax_amount": quotation.tax_amount,
        "start_date": start_date,
        "end_date": None,
        "next_billing_date": next_billing_date,
        "status": "confirmed"
    })
    
    db.commit()
    return sub
