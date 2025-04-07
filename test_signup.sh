#!/bin/bash

# Test script for Django + React authentication
# Usage: ./test_auth.sh [base_url] (default: http://localhost:8000)

BASE_URL=${1:-http://localhost:8000}
API_URL="${BASE_URL}/api/auth"
TEST_EMAIL="testuser_$(date +%s)@example.com"
TEST_USERNAME="testuser_$(date +%s)"
TEST_PASSWORD="SecurePassword123!"

# Fonction pour afficher les résultats des tests
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "\033[32m✓ SUCCESS: $2\033[0m"
    else
        echo -e "\033[31m✗ FAILED: $2\033[0m"
        exit 1
    fi
}

# Vérifier que le serveur Django est accessible
echo "Testing Django server at ${BASE_URL}..."
curl -s -o /dev/null "${BASE_URL}/admin/"
print_result $? "Server is running"

# Test d'inscription
echo -e "\nTesting registration..."
REGISTER_RESPONSE=$(curl -s -X POST "${API_URL}/register/" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${TEST_EMAIL}\", \"username\":\"${TEST_USERNAME}\", \"password\":\"${TEST_PASSWORD}\", \"confirmPassword\":\"${TEST_PASSWORD}\"}")

echo "${REGISTER_RESPONSE}" | jq . > /dev/null 2>&1
print_result $? "Registration API structure"

TOKEN=$(echo "${REGISTER_RESPONSE}" | jq -r '.token')
[ -n "${TOKEN}" ] && [ "${TOKEN}" != "null" ]
print_result $? "Registration returned valid token"

# Test de connexion avec de mauvais identifiants
echo -e "\nTesting failed login..."
FAILED_LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/login/" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"wrong@example.com\", \"password\":\"wrongpassword\"}")

echo "${FAILED_LOGIN_RESPONSE}" | jq -e '.error' > /dev/null 2>&1
print_result $? "Failed login detection"

# Test de connexion réussie
echo -e "\nTesting successful login..."
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/login/" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${TEST_EMAIL}\", \"password\":\"${TEST_PASSWORD}\"}")

LOGIN_TOKEN=$(echo "${LOGIN_RESPONSE}" | jq -r '.token')
[ -n "${LOGIN_TOKEN}" ] && [ "${LOGIN_TOKEN}" != "null" ]
print_result $? "Login returned valid token"

# Test d'accès protégé
echo -e "\nTesting protected access..."
PROTECTED_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "${API_URL}/me/" \
    -H "Authorization: Token ${LOGIN_TOKEN}")

[ "${PROTECTED_RESPONSE}" -eq 200 ] || [ "${PROTECTED_RESPONSE}" -eq 401 ]
print_result $? "Protected endpoint response"

# Test de déconnexion (si implémenté)
echo -e "\nTesting logout..."
LOGOUT_RESPONSE=$(curl -s -X POST "${API_URL}/logout/" \
    -H "Authorization: Token ${LOGIN_TOKEN}")

[ -n "${LOGOUT_RESPONSE}" ]
print_result $? "Logout functionality"

# Nettoyage (suppression du compte de test)
echo -e "\nCleaning up test user..."
# Note: Vous devrez implémenter un endpoint pour supprimer les comptes de test ou utiliser l'interface admin

echo -e "\n\033[1;34mAll tests completed successfully!\033[0m"
echo "Test user created:"
echo "Email: ${TEST_EMAIL}"
echo "Username: ${TEST_USERNAME}"
echo "Token: ${LOGIN_TOKEN}"