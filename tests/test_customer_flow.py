import pytest
from playwright.sync_api import Page, expect

BASE_URL = "https://makhaana-ecommerce.vercel.app"

def test_customer_journey(page: Page):
    # Step 1: Go to home page
    page.goto(BASE_URL)
    expect(page).to_have_title("Makhaana - Premium Fox Nuts | Healthy Snacks")

    # Step 2: Go to Shop
    shop_link = page.get_by_role("link", name="Shop", exact=True).first
    shop_link.click()
    expect(page).to_have_url(f"{BASE_URL}/shop")

    # Step 3: View Product
    product_link = page.get_by_role("link", name="Premium Makhaana").first
    product_link.click()
    expect(page).to_have_url(f"{BASE_URL}/product/premium-makhaana")

    # Wait for product details to load
    page.wait_for_selector(".animate-spin", state="hidden")

    # Step 4: Add to Cart
    add_to_cart_btn = page.get_by_role("button", name="Add to Cart")
    expect(add_to_cart_btn).to_be_visible()
    add_to_cart_btn.click()

    # Wait for toast
    expect(page.locator("text=Added to cart!")).to_be_visible()

    # Step 5: Go to Cart
    cart_link = page.get_by_role("link", name="Cart").first
    cart_link.click()
    expect(page).to_have_url(f"{BASE_URL}/cart")

    # Step 6: Proceed to Checkout
    checkout_link = page.get_by_role("link", name="Checkout")
    checkout_link.click()
    expect(page).to_have_url(f"{BASE_URL}/checkout")

    # Step 7: Fill Shipping Details
    page.locator('input[name="fullName"]').fill("Test User")
    page.locator('input[name="phone"]').fill("9876543210")
    page.locator('input[name="email"]').fill("testuser@example.com")
    page.locator('input[name="addressLine1"]').fill("123 Testing Ave")
    page.locator('input[name="city"]').fill("Mumbai")
    page.locator('input[name="state"]').fill("Maharashtra")
    page.locator('input[name="pincode"]').fill("400001")

    # Step 8: Place Order
    payment_btn = page.get_by_role("button", name="Proceed to Payment")
    payment_btn.click()

    # Wait for Razorpay modal
    # In a headless environment, we just check if it appears
    page.wait_for_selector("iframe.razorpay-checkout-frame", timeout=15000)
