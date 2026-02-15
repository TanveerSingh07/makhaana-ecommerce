import os
import pytest
from playwright.sync_api import Page, expect

BASE_URL = "https://makhaana-ecommerce.vercel.app"
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@makhaana.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "Admin@123")

def test_admin_journey(page: Page):
    # Step 1: Login
    page.goto(f"{BASE_URL}/auth")

    # Fill email and password
    page.locator('input[placeholder="Email address"]').fill(ADMIN_EMAIL)
    page.locator('input[placeholder="Password"]').fill(ADMIN_PASSWORD)

    # Click login button
    submit_btn = page.locator('button:has-text("Login")').nth(1)
    submit_btn.click()

    # Wait for redirection to /admin
    expect(page).to_have_url(f"{BASE_URL}/admin", timeout=20000)

    # Verify Dashboard elements
    expect(page.get_by_role("heading", name="Dashboard")).to_be_visible()
    expect(page.locator("text=Total Orders")).to_be_visible()

    # Step 2: Check Products management
    page.get_by_role("link", name="Products").click()
    expect(page).to_have_url(f"{BASE_URL}/admin/products")
    expect(page.get_by_role("heading", name="Products")).to_be_visible()
    expect(page.get_by_role("heading", name="Create New Product")).to_be_visible()

    # Step 3: Check Orders management
    page.get_by_role("link", name="Orders").click()
    expect(page).to_have_url(f"{BASE_URL}/admin/orders")
    expect(page.get_by_role("heading", name="Orders")).to_be_visible()

    # Step 4: Check Delivery Rules
    page.get_by_role("link", name="Delivery Rules").click()
    expect(page).to_have_url(f"{BASE_URL}/admin/delivery-rules")
    expect(page.get_by_role("heading", name="Delivery Rules")).to_be_visible()

    # Step 5: Check Messages
    page.get_by_role("link", name="Messages").click()
    expect(page).to_have_url(f"{BASE_URL}/admin/messages")
    expect(page.get_by_role("heading", name="Contact Messages")).to_be_visible()
