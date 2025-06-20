#!/bin/bash

echo "🧪 TEST COMPLET - PROFIL + INSTRUCTIONS IA"
echo "=========================================="

# Configuration
API_BASE="http://localhost:5000/api"
EMAIL="user@gmail.com"
PASSWORD="password"

# Fonction pour extraire le token
extract_token() {
    echo "$1" | grep -o '"token":"[^"]*"' | sed 's/"token":"//' | sed 's/"//'
}

# Fonction pour analyser le contenu de la lettre
analyze_letter_content() {
    local letter="$1"
    local instructions="$2"
    
    echo "🔍 ANALYSE DU CONTENU DE LA LETTRE:"
    echo "=================================="
    
    # Vérifier la longueur
    word_count=$(echo "$letter" | wc -w)
    echo "📊 Nombre de mots: $word_count"
    
    # Vérifier le ton (recherche de mots-clés)
    echo ""
    echo "🎯 VÉRIFICATION DES INSTRUCTIONS:"
    
    # Test 1: Ton professionnel vs moderne
    if echo "$instructions" | grep -qi "moderne\|dynamique\|créatif"; then
        echo "🎨 Instructions demandent un ton MODERNE/DYNAMIQUE"
        if echo "$letter" | grep -qi "passionné\|enthousiaste\|innovation\|créativité"; then
            echo "✅ Ton moderne détecté dans la lettre"
        else
            echo "❌ Ton moderne NON détecté - possible problème"
        fi
    fi
    
    if echo "$instructions" | grep -qi "professionnel\|formel\|classique"; then
        echo "👔 Instructions demandent un ton PROFESSIONNEL"
        if echo "$letter" | grep -qi "madame\|monsieur\|cordialement\|respectueusement"; then
            echo "✅ Ton professionnel détecté dans la lettre"
        else
            echo "❌ Ton professionnel NON détecté - possible problème"
        fi
    fi
    
    # Test 2: Longueur respectée
    if echo "$instructions" | grep -qi "concis\|court\|bref"; then
        echo "📏 Instructions demandent une lettre CONCISE"
        if [ $word_count -lt 200 ]; then
            echo "✅ Lettre concise ($word_count mots < 200)"
        else
            echo "❌ Lettre trop longue ($word_count mots) pour instruction 'concise'"
        fi
    fi
    
    if echo "$instructions" | grep -qi "détaillé\|complet\|approfondi"; then
        echo "📖 Instructions demandent une lettre DÉTAILLÉE"
        if [ $word_count -gt 200 ]; then
            echo "✅ Lettre détaillée ($word_count mots > 200)"
        else
            echo "❌ Lettre trop courte ($word_count mots) pour instruction 'détaillée'"
        fi
    fi
    
    # Test 3: Compétences spécifiques mentionnées
    if echo "$instructions" | grep -qi "technique\|informatique\|développement"; then
        echo "💻 Instructions mentionnent des compétences TECHNIQUES"
        if echo "$letter" | grep -qi "technique\|technologie\|développement\|programmation"; then
            echo "✅ Compétences techniques mentionnées dans la lettre"
        else
            echo "❌ Compétences techniques NON mentionnées"
        fi
    fi
    
    # Test 4: Expérience mise en avant
    if echo "$instructions" | grep -qi "expérience\|parcours\|antécédent"; then
        echo "🏆 Instructions demandent de valoriser l'EXPÉRIENCE"
        if echo "$letter" | grep -qi "expérience\|parcours\|années\|poste précédent"; then
            echo "✅ Expérience mise en avant dans la lettre"
        else
            echo "❌ Expérience NON mise en avant"
        fi
    fi
    
    echo ""
}

echo "🔐 ÉTAPE 1: Connexion..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

echo "📥 Réponse login:"
echo "$LOGIN_RESPONSE"

TOKEN=$(extract_token "$LOGIN_RESPONSE")
echo "✅ Token: ${TOKEN:0:30}..."
echo ""

# TEST 1: Instructions pour ton MODERNE et CONCIS
echo "🧪 TEST 1: Instructions TON MODERNE + CONCIS"
echo "============================================="

INSTRUCTIONS_1="Adopte un ton moderne et dynamique. Reste concis, maximum 150 mots. Mets l'accent sur ma créativité et mon innovation."

echo "📝 Instructions envoyées:"
echo "$INSTRUCTIONS_1"
echo ""

LETTER_RESPONSE_1=$(curl -s -X POST "$API_BASE/jobs/generate-cover-letter" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"jobDescription\": \"Recherche DÉVELOPPEUR WEB créatif pour startup. Mission: création d'interfaces innovantes, travail en équipe agile.\",
    \"jobTitle\": \"Développeur Web\",
    \"companyName\": \"TechStart Innovation\",
    \"aiInstructions\": \"$INSTRUCTIONS_1\",
    \"saveToHistory\": false
  }")

echo "📄 RÉPONSE TEST 1:"
echo "$LETTER_RESPONSE_1"
echo ""

# Extraire la lettre pour analyse
LETTER_1=$(echo "$LETTER_RESPONSE_1" | grep -o '"letter":"[^"]*"' | sed 's/"letter":"//' | sed 's/\\n/ /g' | sed 's/"//')
analyze_letter_content "$LETTER_1" "$INSTRUCTIONS_1"

echo ""
echo "=================================================="
echo ""

# TEST 2: Instructions pour ton PROFESSIONNEL et DÉTAILLÉ
echo "🧪 TEST 2: Instructions TON PROFESSIONNEL + DÉTAILLÉ"
echo "===================================================="

INSTRUCTIONS_2="Utilise un ton très professionnel et formel. Rédige une lettre détaillée et complète. Insiste sur mon expérience et mes compétences techniques en développement."

echo "📝 Instructions envoyées:"
echo "$INSTRUCTIONS_2"
echo ""

LETTER_RESPONSE_2=$(curl -s -X POST "$API_BASE/jobs/generate-cover-letter" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"jobDescription\": \"Recherche INGÉNIEUR LOGICIEL senior. Développement d'applications complexes, gestion d'équipe, architecture système.\",
    \"jobTitle\": \"Ingénieur Logiciel Senior\",
    \"companyName\": \"Corporate Solutions Ltd\",
    \"aiInstructions\": \"$INSTRUCTIONS_2\",
    \"saveToHistory\": false
  }")

echo "📄 RÉPONSE TEST 2:"
echo "$LETTER_RESPONSE_2"
echo ""

# Extraire la lettre pour analyse
LETTER_2=$(echo "$LETTER_RESPONSE_2" | grep -o '"letter":"[^"]*"' | sed 's/"letter":"//' | sed 's/\\n/ /g' | sed 's/"//')
analyze_letter_content "$LETTER_2" "$INSTRUCTIONS_2"

echo ""
echo "=================================================="
echo ""

# TEST 3: Instructions CONTRADICTOIRES (pour tester la robustesse)
echo "🧪 TEST 3: Instructions CONTRADICTOIRES"
echo "======================================="

INSTRUCTIONS_3="Sois à la fois très concis (moins de 100 mots) ET très détaillé. Utilise un ton professionnel mais aussi très créatif et moderne."

echo "📝 Instructions envoyées (contradictoires):"
echo "$INSTRUCTIONS_3"
echo ""

LETTER_RESPONSE_3=$(curl -s -X POST "$API_BASE/jobs/generate-cover-letter" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"jobDescription\": \"Poste polyvalent dans une PME. Gestion client, administration, projets divers.\",
    \"jobTitle\": \"Assistant Polyvalent\",
    \"companyName\": \"MultiTâches SARL\",
    \"aiInstructions\": \"$INSTRUCTIONS_3\",
    \"saveToHistory\": false
  }")

echo "📄 RÉPONSE TEST 3:"
echo "$LETTER_RESPONSE_3"
echo ""

# Extraire la lettre pour analyse
LETTER_3=$(echo "$LETTER_RESPONSE_3" | grep -o '"letter":"[^"]*"' | sed 's/"letter":"//' | sed 's/\\n/ /g' | sed 's/"//')
analyze_letter_content "$LETTER_3" "$INSTRUCTIONS_3"

echo ""
echo "=================================================="
echo ""

# ANALYSE GLOBALE
echo "📊 ANALYSE GLOBALE DES TESTS"
echo "============================="

echo "🎯 VÉRIFICATIONS TECHNIQUES:"
echo "1. Les 3 tests ont-ils généré des lettres différentes ?"
echo "2. Le profil utilisateur est-il utilisé dans tous les cas ?"
echo "3. Les instructions sont-elles réellement prises en compte ?"
echo ""

echo "✅ RÉSUMÉ DES OBSERVATIONS:"
echo "• TEST 1 (Moderne/Concis): Vérifiez le ton et la longueur"
echo "• TEST 2 (Prof/Détaillé): Vérifiez le formalisme et la longueur"  
echo "• TEST 3 (Contradictoire): Vérifiez comment l'IA gère les conflits"
echo ""

echo "🔍 INDICATEURS DE QUALITÉ:"
echo "• Lettres différentes = ✅ Instructions prises en compte"
echo "• Lettres identiques = ❌ Instructions ignorées"
echo "• Profil utilisé = ✅ Système fonctionne"
echo "• Profil non utilisé = ❌ Problème technique"
echo ""

echo "🎉 TEST TERMINÉ - ANALYSEZ LES RÉSULTATS CI-DESSUS"