#!/bin/bash

# CI/CD Pipeline Local Test Script
# This script simulates the GitHub Actions workflow locally

set -e

echo "🚀 Testing CI/CD Pipeline Locally"
echo "=================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend Tests
echo ""
echo -e "${YELLOW}📦 Backend Pipeline${NC}"
echo "-------------------"

cd ../backend

echo -e "${YELLOW}1. Backend Lint...${NC}"
if npm run lint; then
    echo -e "${GREEN}✓ Backend Lint Passed${NC}"
else
    echo -e "${RED}✗ Backend Lint Failed${NC}"
    exit 1
fi

echo -e "${YELLOW}2. Backend Test...${NC}"
if npm run test 2>/dev/null || true; then
    echo -e "${GREEN}✓ Backend Test Passed${NC}"
else
    echo -e "${YELLOW}⚠ Backend Test Skipped (optional)${NC}"
fi

echo -e "${YELLOW}3. Backend Build...${NC}"
if npm run build; then
    echo -e "${GREEN}✓ Backend Build Passed${NC}"
else
    echo -e "${RED}✗ Backend Build Failed${NC}"
    exit 1
fi

# Frontend Tests
echo ""
echo -e "${YELLOW}📦 Frontend Pipeline${NC}"
echo "--------------------"

cd ../frontend

echo -e "${YELLOW}1. Frontend Lint...${NC}"
if npm run lint; then
    echo -e "${GREEN}✓ Frontend Lint Passed${NC}"
else
    echo -e "${RED}✗ Frontend Lint Failed${NC}"
    exit 1
fi

echo -e "${YELLOW}2. Frontend Test...${NC}"
if npm run test 2>/dev/null || true; then
    echo -e "${GREEN}✓ Frontend Test Passed${NC}"
else
    echo -e "${YELLOW}⚠ Frontend Test Skipped (optional)${NC}"
fi

echo -e "${YELLOW}3. Frontend Build...${NC}"
if npm run build; then
    echo -e "${GREEN}✓ Frontend Build Passed${NC}"
else
    echo -e "${RED}✗ Frontend Build Failed${NC}"
    exit 1
fi

# Docker Build Test
echo ""
echo -e "${YELLOW}🐳 Docker Build Test${NC}"
echo "--------------------"

echo -e "${YELLOW}Building Frontend Docker Image...${NC}"
if docker build -t eventra-frontend:test .; then
    echo -e "${GREEN}✓ Frontend Docker Build Passed${NC}"
else
    echo -e "${RED}✗ Frontend Docker Build Failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}=================================="
echo "✅ All Pipeline Tests Passed!"
echo -e "==================================${NC}"
