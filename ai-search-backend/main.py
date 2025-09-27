from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import re
from difflib import SequenceMatcher

app = FastAPI(title="Monastery360 AI Search", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Comprehensive archive and monastery data
ARCHIVES_DATA = [
    {
        "id": "archive_1",
        "title": "Ancient Thangka Paintings",
        "description": "Collection of traditional Tibetan Buddhist scroll paintings from the 15th century featuring deities, mandalas, and religious scenes",
        "type": "Art",
        "monastery": "Rumtek Monastery",
        "tags": ["thangka", "painting", "buddhist", "art", "tibetan", "scroll", "deities", "mandala", "religious", "15th century"],
        "redirect_url": "/archives#thangka-paintings",
        "category": "archive",
        "year": "15th Century",
        "artist": "Unknown Tibetan Masters"
    },
    {
        "id": "archive_2", 
        "title": "Sacred Manuscripts",
        "description": "Rare Buddhist scriptures and prayer texts written in Tibetan script including the Kangyur and Tengyur collections",
        "type": "Literature",
        "monastery": "Pemayangtse Monastery",
        "tags": ["manuscript", "scripture", "prayer", "tibetan", "buddhist", "text", "kangyur", "tengyur", "sacred", "script"],
        "redirect_url": "/archives#sacred-manuscripts",
        "category": "archive",
        "year": "Various",
        "language": "Tibetan"
    },
    {
        "id": "archive_3",
        "title": "Ceremonial Artifacts",
        "description": "Traditional ritual objects used in Buddhist ceremonies and festivals including prayer wheels, bells, and offering bowls",
        "type": "Artifact",
        "monastery": "Tashiding Monastery", 
        "tags": ["ceremony", "ritual", "artifact", "buddhist", "festival", "traditional", "prayer wheel", "bell", "offering bowl", "ritual object"],
        "redirect_url": "/archives#ceremonial-artifacts",
        "category": "archive",
        "year": "Various",
        "material": "Bronze, Wood, Silver"
    },
    {
        "id": "archive_4",
        "title": "Historical Photographs",
        "description": "Vintage photographs documenting monastery life, architecture, and daily rituals from the early 20th century",
        "type": "Photography",
        "monastery": "Rumtek Monastery",
        "tags": ["photograph", "history", "architecture", "monastery", "vintage", "documentation", "20th century", "daily life", "rituals"],
        "redirect_url": "/archives#historical-photographs",
        "category": "archive",
        "year": "Early 20th Century",
        "photographer": "Various"
    },
    {
        "id": "archive_5",
        "title": "Musical Instruments",
        "description": "Traditional Tibetan musical instruments used in religious ceremonies including dungchen, gyaling, and damaru",
        "type": "Music",
        "monastery": "Pemayangtse Monastery",
        "tags": ["music", "instrument", "tibetan", "ceremony", "religious", "traditional", "dungchen", "gyaling", "damaru", "ritual music"],
        "redirect_url": "/archives#musical-instruments",
        "category": "archive",
        "year": "Various",
        "instruments": ["Dungchen", "Gyaling", "Damaru", "Cymbals"]
    },
    {
        "id": "archive_6",
        "title": "Architectural Drawings",
        "description": "Detailed architectural plans and designs of monastery structures showing traditional Tibetan building techniques",
        "type": "Architecture",
        "monastery": "Tashiding Monastery",
        "tags": ["architecture", "drawing", "design", "monastery", "structure", "plan", "tibetan", "building", "technique", "blueprint"],
        "redirect_url": "/archives#architectural-drawings",
        "category": "archive",
        "year": "Various",
        "architect": "Traditional Tibetan Architects"
    },
    {
        "id": "archive_7",
        "title": "Buddhist Statues Collection",
        "description": "Ancient bronze and wooden statues of Buddha, Bodhisattvas, and other deities from various periods",
        "type": "Sculpture",
        "monastery": "Rumtek Monastery",
        "tags": ["statue", "buddha", "bodhisattva", "deity", "bronze", "wooden", "sculpture", "ancient", "religious", "art"],
        "redirect_url": "/archives#buddhist-statues",
        "category": "archive",
        "year": "Various",
        "material": "Bronze, Wood, Stone"
    },
    {
        "id": "archive_8",
        "title": "Prayer Flags Archive",
        "description": "Collection of traditional prayer flags with mantras and symbols used in Buddhist ceremonies",
        "type": "Textile",
        "monastery": "Pemayangtse Monastery",
        "tags": ["prayer flag", "mantra", "symbol", "textile", "buddhist", "ceremony", "traditional", "flag", "religious", "symbolism"],
        "redirect_url": "/archives#prayer-flags",
        "category": "archive",
        "year": "Various",
        "material": "Cotton, Silk"
    },
    {
        "id": "archive_9",
        "title": "Monastery Chronicles",
        "description": "Historical records and chronicles documenting the founding and development of Sikkim's monasteries",
        "type": "Document",
        "monastery": "Tashiding Monastery",
        "tags": ["chronicle", "history", "record", "founding", "development", "monastery", "document", "historical", "sikkim", "archive"],
        "redirect_url": "/archives#monastery-chronicles",
        "category": "archive",
        "year": "Various",
        "language": "Tibetan, English"
    },
    {
        "id": "archive_10",
        "title": "Festival Costumes",
        "description": "Traditional costumes and ceremonial attire worn during Buddhist festivals and religious ceremonies",
        "type": "Costume",
        "monastery": "Rumtek Monastery",
        "tags": ["costume", "ceremonial", "attire", "festival", "buddhist", "traditional", "religious", "ceremony", "clothing", "dress"],
        "redirect_url": "/archives#festival-costumes",
        "category": "archive",
        "year": "Various",
        "material": "Silk, Brocade, Cotton"
    }
]

MONASTERIES_DATA = [
    {
        "id": "monastery_1",
        "name": "Rumtek Monastery",
        "description": "The largest monastery in Sikkim, known for its golden roof and traditional architecture",
        "location": "Gangtok, Sikkim",
        "tags": ["rumtek", "gangtok", "golden", "roof", "largest", "traditional"],
        "redirect_url": "/map",
        "category": "monastery"
    },
    {
        "id": "monastery_2", 
        "name": "Pemayangtse Monastery",
        "description": "Ancient monastery with white walls and stunning mountain views",
        "location": "Pelling, Sikkim",
        "tags": ["pemayangtse", "pelling", "white", "walls", "mountain", "ancient"],
        "redirect_url": "/map",
        "category": "monastery"
    },
    {
        "id": "monastery_3",
        "name": "Tashiding Monastery", 
        "description": "Hilltop monastery with prayer flags and valley views",
        "location": "Tashiding, Sikkim",
        "tags": ["tashiding", "hilltop", "prayer", "flags", "valley", "views"],
        "redirect_url": "/map",
        "category": "monastery"
    }
]

FESTIVALS_DATA = [
    {
        "id": "festival_1",
        "name": "Losar Festival",
        "description": "Tibetan New Year celebration with traditional dances, ceremonies, and cultural performances",
        "date": "February",
        "tags": ["losar", "new year", "tibetan", "dance", "ceremony", "celebration", "tibetan new year", "cultural performance"],
        "redirect_url": "/calendar#losar-festival",
        "category": "festival",
        "monastery": "All Monasteries",
        "type": "Religious Festival"
    },
    {
        "id": "festival_2",
        "name": "Saga Dawa",
        "description": "Buddhist festival commemorating Buddha's birth, enlightenment, and death with prayer ceremonies",
        "date": "May-June",
        "tags": ["saga dawa", "buddha", "birth", "enlightenment", "death", "buddhist", "prayer", "ceremony", "holy month"],
        "redirect_url": "/calendar#saga-dawa",
        "category": "festival",
        "monastery": "All Monasteries",
        "type": "Religious Festival"
    },
    {
        "id": "festival_3",
        "name": "Tihar Festival",
        "description": "Hindu festival of lights celebrated across Sikkim with traditional rituals and decorations",
        "date": "October-November",
        "tags": ["tihar", "lights", "hindu", "festival", "celebration", "sikkim", "diwali", "lamps", "rituals"],
        "redirect_url": "/calendar#tihar-festival",
        "category": "festival",
        "monastery": "All Monasteries",
        "type": "Religious Festival"
    },
    {
        "id": "festival_4",
        "name": "Bumchu Festival",
        "description": "Sacred water festival at Tashiding Monastery where the water level predicts the year's fortune",
        "date": "February-March",
        "tags": ["bumchu", "water", "sacred", "tashiding", "fortune", "prediction", "ritual", "monastery"],
        "redirect_url": "/calendar#bumchu-festival",
        "category": "festival",
        "monastery": "Tashiding Monastery",
        "type": "Sacred Festival"
    },
    {
        "id": "festival_5",
        "name": "Pang Lhabsol",
        "description": "Festival honoring Mount Kanchenjunga as the guardian deity of Sikkim",
        "date": "August-September",
        "tags": ["pang lhabsol", "kanchenjunga", "mountain", "guardian", "deity", "sikkim", "worship", "nature"],
        "redirect_url": "/calendar#pang-lhabsol",
        "category": "festival",
        "monastery": "All Monasteries",
        "type": "Cultural Festival"
    },
    {
        "id": "festival_6",
        "name": "Dasain Festival",
        "description": "Nepali Hindu festival celebrating the victory of good over evil with traditional dances",
        "date": "September-October",
        "tags": ["dasain", "nepali", "hindu", "victory", "good", "evil", "dance", "traditional", "celebration"],
        "redirect_url": "/calendar#dasain-festival",
        "category": "festival",
        "monastery": "All Monasteries",
        "type": "Cultural Festival"
    },
    {
        "id": "festival_7",
        "name": "Lhabab Duchen",
        "description": "Buddhist festival commemorating Buddha's descent from heaven to earth",
        "date": "October-November",
        "tags": ["lhabab duchen", "buddha", "descent", "heaven", "earth", "buddhist", "commemoration", "religious"],
        "redirect_url": "/calendar#lhabab-duchen",
        "category": "festival",
        "monastery": "All Monasteries",
        "type": "Religious Festival"
    },
    {
        "id": "festival_8",
        "name": "Guru Rinpoche's Birthday",
        "description": "Celebration of the birth of Guru Rinpoche, the founder of Tibetan Buddhism",
        "date": "June-July",
        "tags": ["guru rinpoche", "birthday", "founder", "tibetan buddhism", "celebration", "religious", "guru"],
        "redirect_url": "/calendar#guru-rinpoche-birthday",
        "category": "festival",
        "monastery": "All Monasteries",
        "type": "Religious Festival"
    }
]

# Combine all data for comprehensive search
ALL_DATA = ARCHIVES_DATA + MONASTERIES_DATA + FESTIVALS_DATA

class SearchResult(BaseModel):
    id: str
    title: str
    description: str
    type: Optional[str] = None
    monastery: Optional[str] = None
    location: Optional[str] = None
    date: Optional[str] = None
    tags: List[str]
    redirect_url: str
    category: str
    relevance_score: float

class SearchResponse(BaseModel):
    query: str
    results: List[SearchResult]
    total_results: int
    search_type: str
    suggestions: List[str]

def calculate_relevance_score(query: str, item: Dict[str, Any]) -> float:
    """Calculate relevance score based on query matching with enhanced precision"""
    query_lower = query.lower().strip()
    query_words = query_lower.split()
    score = 0.0
    
    # Combine all searchable text fields
    searchable_text = []
    
    # Add title/name
    if 'title' in item:
        searchable_text.append(item['title'].lower())
    if 'name' in item:
        searchable_text.append(item['name'].lower())
    
    # Add description
    if 'description' in item:
        searchable_text.append(item['description'].lower())
    
    # Add tags
    if 'tags' in item:
        searchable_text.extend([tag.lower() for tag in item['tags']])
    
    # Add other fields
    for field in ['monastery', 'type', 'year', 'artist', 'language', 'material', 'instruments', 'architect', 'photographer']:
        if field in item and item[field]:
            searchable_text.append(str(item[field]).lower())
    
    # Combine all text for full-text search
    full_text = ' '.join(searchable_text)
    
    # Exact phrase match (highest priority)
    if query_lower in full_text:
        score += 50
    
    # Check if all query words are present (multi-word search boost)
    words_found = sum(1 for word in query_words if word in full_text)
    if words_found == len(query_words) and len(query_words) > 1:
        score += 40  # All words found boost
    
    # Individual word matching
    for word in query_words:
        if word in full_text:
            score += 15
    
    # Exact title/name match gets highest score
    title = item.get('title', '').lower()
    name = item.get('name', '').lower()
    
    if query_lower == title or query_lower == name:
        score += 100
    elif query_lower in title or query_lower in name:
        score += 70
    
    # Tag-specific matching (higher weight for tags)
    tags = item.get('tags', [])
    for tag in tags:
        tag_lower = tag.lower()
        if query_lower == tag_lower:
            score += 30
        elif query_lower in tag_lower:
            score += 20
        elif any(word in tag_lower for word in query_words):
            score += 12
    
    # Description matching
    description = item.get('description', '').lower()
    if query_lower in description:
        score += 25
    elif any(word in description for word in query_words):
        score += 8
    
    # Monastery name match
    monastery = item.get('monastery', '').lower()
    if query_lower in monastery:
        score += 20
    elif any(word in monastery for word in query_words):
        score += 10
    
    # Type match
    item_type = item.get('type', '').lower()
    if query_lower == item_type:
        score += 25
    elif query_lower in item_type:
        score += 15
    elif any(word in item_type for word in query_words):
        score += 8
    
    # Additional fields matching
    for field in ['year', 'artist', 'language', 'material', 'instruments', 'architect', 'photographer']:
        if field in item and item[field]:
            field_value = str(item[field]).lower()
            if query_lower in field_value:
                score += 15
            elif any(word in field_value for word in query_words):
                score += 6
    
    # Fuzzy matching for similar words
    for field in ['title', 'name', 'monastery', 'type']:
        if field in item and item[field]:
            similarity = SequenceMatcher(None, query_lower, item[field].lower()).ratio()
            if similarity > 0.7:
                score += similarity * 10
            elif similarity > 0.5:
                score += similarity * 5
    
    # Boost score for multi-word searches that match well
    if len(query_words) > 1 and words_found >= len(query_words) * 0.7:
        score += 15
    
    return score

def generate_suggestions(query: str) -> List[str]:
    """Generate search suggestions based on query"""
    suggestions = []
    query_lower = query.lower()
    
    # Add suggestions based on partial matches
    for item in ALL_DATA:
        title = item.get('title', item.get('name', ''))
        if query_lower in title.lower() and len(suggestions) < 5:
            suggestions.append(title)
    
    # Add category suggestions
    categories = ['archives', 'monasteries', 'festivals', 'thangka', 'manuscripts', 'rumtek', 'pemayangtse']
    for cat in categories:
        if query_lower in cat and cat not in suggestions:
            suggestions.append(cat)
    
    return suggestions[:5]

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Monastery360 AI Search",
        "version": "1.0.0",
        "total_items": len(ALL_DATA),
        "archives": len(ARCHIVES_DATA),
        "monasteries": len(MONASTERIES_DATA),
        "festivals": len(FESTIVALS_DATA),
        "features": [
            "AI-powered search",
            "Archive-specific redirects", 
            "Festival calendar integration",
            "Monastery location mapping",
            "Fuzzy matching",
            "Relevance scoring"
        ]
    }

@app.get("/search", response_model=SearchResponse)
async def search(
    q: str = Query(..., min_length=1, description="Search query"),
    limit: int = Query(10, ge=1, le=50, description="Maximum results to return")
):
    """AI-powered search across archives, monasteries, and festivals"""
    
    if not q.strip():
        raise HTTPException(status_code=400, detail="Search query cannot be empty")
    
    # Calculate relevance scores for all items
    scored_items = []
    for item in ALL_DATA:
        score = calculate_relevance_score(q, item)
        if score > 0:  # Only include items with some relevance
            scored_items.append((item, score))
    
    # Sort by relevance score (highest first)
    scored_items.sort(key=lambda x: x[1], reverse=True)
    
    # Take top results (lower threshold for multi-word searches)
    if len(q.split()) > 1:
        # For multi-word searches, be more lenient
        top_results = scored_items[:limit * 2]  # Get more results to filter
        # Filter to ensure we have good matches
        top_results = [(item, score) for item, score in top_results if score >= 10]
        top_results = top_results[:limit]
    else:
        # For single word searches, use normal threshold
        top_results = scored_items[:limit]
    
    # Format results
    results = []
    for item, score in top_results:
        result = SearchResult(
            id=item['id'],
            title=item.get('title', item.get('name', '')),
            description=item['description'],
            type=item.get('type'),
            monastery=item.get('monastery'),
            location=item.get('location'),
            date=item.get('date'),
            tags=item['tags'],
            redirect_url=item['redirect_url'],
            category=item['category'],
            relevance_score=score
        )
        results.append(result)
    
    # Generate suggestions
    suggestions = generate_suggestions(q)
    
    return SearchResponse(
        query=q,
        results=results,
        total_results=len(results),
        search_type="ai_enhanced",
        suggestions=suggestions
    )

@app.get("/suggestions")
async def get_suggestions(
    q: str = Query(..., min_length=1, description="Partial search query")
):
    """Get search suggestions for autocomplete"""
    suggestions = generate_suggestions(q)
    return {"query": q, "suggestions": suggestions}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8007)