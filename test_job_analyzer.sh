#!/bin/bash

echo "🔍 TEST SIMPLE JOB ANALYZER"
echo "=========================="

# Connexion
echo "🔐 Connexion..."
LOGIN_RESPONSE=$(curl -s -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@gmail.com","password":"password"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | sed 's/"token":"//' | sed 's/"//')
echo "Token: ${TOKEN:0:20}..."

# Test analyse
echo "🔍 Test analyse..."
curl -s -X POST "http://localhost:5000/api/jobs/analyze" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "jobText": "Recherche Développeur React Senior. Compétences: React, Node.js, MongoDB, JavaScript. Salaire: 50-60k€. CDI Paris.",
    "saveJob": true,
    "jobTitle": "Développeur React Senior",
    "companyName": "TechCorp"
  }' | python -m json.tool

echo "✅ Test terminé!"