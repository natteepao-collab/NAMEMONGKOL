---
name: keyword-research
description: Discovers high-value keywords with search intent analysis, difficulty assessment, and content opportunity mapping. Essential for starting any SEO or GEO content strategy.
---

# Keyword Research

This skill helps you discover, analyze, and prioritize keywords for SEO and GEO content strategies. It identifies high-value opportunities based on search volume, competition, intent, and business relevance.

> **Project Context**: For specific guidelines and keywords related to the **NameMongkol** project, please refer to the [Project Context](./project_context.md) file in this directory.

## When to Use This Skill

- Starting a new content strategy or campaign
- Expanding into new topics or markets
- Finding keywords for a specific product or service
- Identifying long-tail keyword opportunities
- Understanding search intent for your industry
- Planning content calendars
- Researching keywords for GEO optimization

## What This Skill Does

1. **Keyword Discovery**: Generates comprehensive keyword lists from seed terms
2. **Intent Classification**: Categorizes keywords by user intent (informational, navigational, commercial, transactional)
3. **Difficulty Assessment**: Evaluates competition level and ranking difficulty
4. **Opportunity Scoring**: Prioritizes keywords by potential ROI
5. **Clustering**: Groups related keywords into topic clusters
6. **GEO Relevance**: Identifies keywords likely to trigger AI responses

## How to Use

### Basic Keyword Research

```
Research keywords for [topic/product/service]
```

```
Find keyword opportunities for a [industry] business targeting [audience]
```

### With Specific Goals

```
Find low-competition keywords for [topic] with commercial intent
```

```
Identify question-based keywords for [topic] that AI systems might answer
```

### Competitive Research

```
What keywords is [competitor URL] ranking for that I should target?
```

## Instructions

When a user requests keyword research:

1. **Understand the Context**

   Ask clarifying questions if not provided:
   - What is your product/service/topic?
   - Who is your target audience?
   - What is your business goal? (traffic, leads, sales)
   - What is your current domain authority? (new site, established, etc.)
   - Any specific geographic targeting?
   - Preferred language?

2. **Generate Seed Keywords**

   Start with:
   - Core product/service terms
   - Problem-focused keywords (what issues do you solve?)
   - Solution-focused keywords (how do you help?)
   - Audience-specific terms
   - Industry terminology

3. **Expand Keyword List**

   For each seed keyword, generate variations:
   
   ```markdown
   ## Keyword Expansion Patterns
   
   ### Modifiers
   - Best [keyword]
   - Top [keyword]
   - [keyword] for [audience]
   - [keyword] near me
   - [keyword] [year]
   - How to [keyword]
   - What is [keyword]
   - [keyword] vs [alternative]
   - [keyword] examples
   - [keyword] tools
   
   ### Long-tail Variations
   - [keyword] for beginners
   - [keyword] for small business
   - Free [keyword]
   - [keyword] software/tool/service
   - [keyword] template
   - [keyword] checklist
   - [keyword] guide
   ```

4. **Classify Search Intent**

   Categorize each keyword:

   | Intent | Signals | Example | Content Type |
   |--------|---------|---------|--------------|
   | Informational | what, how, why, guide, learn | "what is SEO" | Blog posts, guides |
   | Navigational | brand names, specific sites | "google analytics login" | Homepage, product pages |
   | Commercial | best, review, vs, compare | "best SEO tools 2024" | Comparison posts, reviews |
   | Transactional | buy, price, discount, order | "buy SEO software" | Product pages, pricing |

5. **Assess Keyword Difficulty**

   Score each keyword (1-100 scale):

   ```markdown
   ### Difficulty Factors
   
   **High Difficulty (70-100)**
   - Major brands ranking
   - High domain authority competitors
   - Established content (1000+ backlinks)
   - Paid ads dominating SERP
   
   **Medium Difficulty (40-69)**
   - Mix of authority and niche sites
   - Some opportunities for quality content
   - Moderate backlink requirements
   
   **Low Difficulty (1-39)**
   - Few authoritative competitors
   - Thin or outdated content ranking
   - Long-tail variations
   - New or emerging topics
   ```

6. **Calculate Opportunity Score**

   Formula: `Opportunity = (Volume × Intent Value) / Difficulty`

   ```markdown
   ### Opportunity Matrix
   
   | Scenario | Volume | Difficulty | Intent | Priority |
   |----------|--------|------------|--------|----------|
   | Quick Win | Low-Med | Low | High | ⭐⭐⭐⭐⭐ |
   | Growth | High | Medium | High | ⭐⭐⭐⭐ |
   | Long-term | High | High | High | ⭐⭐⭐ |
   | Research | Low | Low | Low | ⭐⭐ |
   ```

7. **Identify GEO Opportunities**

   Keywords likely to trigger AI responses:
   
   ```markdown
   ### GEO-Relevant Keywords
   
   **High GEO Potential**
   - Question formats: "What is...", "How does...", "Why is..."
   - Definition queries: "[term] meaning", "[term] definition"
   - Comparison queries: "[A] vs [B]", "difference between..."
   - List queries: "best [category]", "top [number] [items]"
   - How-to queries: "how to [action]", "steps to [goal]"
   
   **AI Answer Indicators**
   - Query is factual/definitional
   - Answer can be summarized concisely
   - Topic is well-documented online
   - Low commercial intent
   ```

8. **Create Topic Clusters**

   Group keywords into content clusters:

   ```markdown
   ## Topic Cluster: [Main Topic]
   
   **Pillar Content**: [Primary keyword]
   - Search volume: [X]
   - Difficulty: [X]
   - Content type: Comprehensive guide
   
   **Cluster Content**:
   
   ### Sub-topic 1: [Secondary keyword]
   - Volume: [X]
   - Difficulty: [X]
   - Links to: Pillar
   - Content type: [Blog post/Tutorial/etc.]
   
   ### Sub-topic 2: [Secondary keyword]
   - Volume: [X]
   - Difficulty: [X]
   - Links to: Pillar + Sub-topic 1
   - Content type: [Blog post/Tutorial/etc.]
   
   [Continue for all cluster keywords...]
   ```

9. **Generate Output Report**

   ```markdown
   # Keyword Research Report: [Topic]
   
   **Generated**: [Date]
   **Target Audience**: [Audience]
   **Business Goal**: [Goal]
   
   ## Executive Summary
   
   - Total keywords analyzed: [X]
   - High-priority opportunities: [X]
   - Estimated traffic potential: [X]/month
   - Recommended focus areas: [List]
   
   ## Top Keyword Opportunities
   
   ### Quick Wins (Low difficulty, High value)
   
   | Keyword | Volume | Difficulty | Intent | Score |
   |---------|--------|------------|--------|-------|
   | [keyword 1] | [X] | [X] | [type] | [X] |
   | [keyword 2] | [X] | [X] | [type] | [X] |
   
   ### Growth Keywords (Medium difficulty, High volume)
   
   | Keyword | Volume | Difficulty | Intent | Score |
   |---------|--------|------------|--------|-------|
   | [keyword 1] | [X] | [X] | [type] | [X] |
   
   ### GEO Opportunities (AI-citation potential)
   
   | Keyword | Type | AI Potential | Recommended Format |
   |---------|------|--------------|-------------------|
   | [keyword 1] | Question | High | Q&A section |
   | [keyword 2] | Definition | High | Clear definition |
   
   ## Topic Clusters
   
   [Include cluster maps]
   
   ## Content Calendar Recommendations
   
   | Month | Content | Target Keyword | Type |
   |-------|---------|----------------|------|
   | [Month] | [Title] | [Keyword] | [Type] |
   
   ## Next Steps
   
   1. [Action item 1]
   2. [Action item 2]
   3. [Action item 3]
   ```

## Example

**User**: "Research keywords for auspicous naming for newborns (Thai naming)"

**Output**:

```markdown
# Keyword Research Report: Auspicious Naming (ตั้งชื่อมงคล)

**Generated**: February 2026
**Target Audience**: Expectant parents, individuals seeking luck
**Business Goal**: Traffic to analysis tool & Premium Naming Service

## Executive Summary

- Total keywords analyzed: 200+
- High-priority opportunities: 15
- Estimated traffic potential: 120,000/month
- Recommended focus areas: 
  - Auspicious names by birthday (Year 2569)
  - Name analysis program (Free tool)
  - Meaning of numerology sum (เลขศาสตร์)
  - Forbidden letters (กาลกิณี)

## Top Keyword Opportunities

### Quick Wins (Priority: Immediate)

| Keyword | Volume | Difficulty | Intent | Score |
|---------|--------|------------|--------|-------|
| ชื่อมงคลตามวันเกิด 2569 | 15,000 | 35 | Informational | 95 |
| วิเคราะห์ชื่อฟรี | 45,000 | 42 | Transactional | 90 |
| ตั้งชื่อลูกสาวพร้อมความหมาย | 12,000 | 28 | Informational | 88 |
| อักษรกาลกิณีวันจันทร์ | 3,500 | 15 | Informational | 85 |
| เปลี่ยนชื่อที่ไหนดี | 2,800 | 22 | Commercial | 82 |

### Growth Keywords (Priority: 3-6 months)

| Keyword | Volume | Difficulty | Intent | Score |
|---------|--------|------------|--------|-------|
| ชื่อมงคล | 150,000 | 75 | Informational | 65 |
| ดูดวงชื่อ | 90,000 | 68 | Transactional | 62 |
| ความหมายชื่อ | 60,000 | 60 | Informational | 58 |

### GEO Opportunities (AI-citation potential)

| Keyword | Type | AI Potential | Recommended Format |
|---------|------|--------------|-------------------|
| วิธีตั้งชื่อลูกตามหลักเลขศาสตร์ | How-to | ⭐⭐⭐⭐⭐ | Step-by-step guide with calculator |
| ทักษาปกรณ์คืออะไร | Definition | ⭐⭐⭐⭐⭐ | Clear definition + table |
| ชื่อมงคลคนเกิดวันอังคาร | List | ⭐⭐⭐⭐ | List with meanings |
| ผลรวมเลขศาสตร์ 45 ดีไหม | Question | ⭐⭐⭐⭐ | Detailed answer with pros/cons |

## Topic Clusters

### Cluster 1: Naming Principles (หลักการตั้งชื่อ)

**Pillar**: "Complete Guide to Thai Naming Science" (คู่มือตั้งชื่อมงคลฉบับสมบูรณ์)

Cluster articles:
1. What is Numerology? (เลขศาสตร์คืออะไร)
2. Understanding Thaksa (ทักษาปกรณ์และอักษรตามวันเกิด)
3. Ayatana 6 Explained (อายตนะ 6 คืออะไร)
4. Shadow Power in Naming (พลังเงาและพลังซ้อน)

### Cluster 2: Naming by Birthday (ตั้งชื่อตามวันเกิด)

**Pillar**: "Auspicious Names by Birthday 2026" (ตั้งชื่อมงคลตามวันเกิด 2569)

Cluster articles:
1. Auspicious names for Sunday (ชื่อมงคลวันอาทิตย์)
2. Auspicious names for Monday (ชื่อมงคลวันจันทร์)
3. ... (Tuesday - Saturday)
4. Forbidden letters for each day (อักษรกาลกิณีประจำวัน)

## Content Calendar Recommendations

| Month | Content | Target Keyword | Type |
|-------|---------|----------------|------|
| Week 1 | 4 Naming Sciences You Must Know | ศาสตร์การตั้งชื่อ | Educational Guide |
| Week 2 | Numerology 101: Numbers 0-9 | ความหมายตัวเลข | Educational |
| Week 3 | Check Your Forbidden Letters | อักษรกาลกิณี | Interactive/List |
| Week 4 | Top 10 Popular Names 2026 | ชื่อยอดฮิต 2569 | Trend |

## Next Steps

1. **Immediate**: Optimize homepage for "วิเคราะห์ชื่อ"
2. **Week 1-2**: Publish "Auspicious Names by Birthday 2569" pillar page
3. **Week 3-4**: Create calculator/tool landing pages
4. **Ongoing**: Monitor rankings for "ชื่อมงคล"
```

## Related Skills

- [competitor-analysis](../competitor-analysis/) - See what keywords competitors rank for
- [content-gap-analysis](../content-gap-analysis/) - Find missing keyword opportunities
- [seo-content-writer](../../build/seo-content-writer/) - Create content for target keywords
- [geo-content-optimizer](../../build/geo-content-optimizer/) - Optimize for AI citations
