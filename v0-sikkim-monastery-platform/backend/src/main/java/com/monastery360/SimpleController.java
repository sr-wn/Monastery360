package com.monastery360;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.*;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://monastery360.vercel.app"})
public class SimpleController {
    
    @GetMapping("/")
    public ResponseEntity<Map<String, String>> home() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Monastery360 Backend is running!");
        response.put("status", "SUCCESS");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/api/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Backend is healthy!");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/api/monasteries")
    public ResponseEntity<List<Map<String, Object>>> getMonasteries() {
        List<Map<String, Object>> monasteries = new ArrayList<>();
        
        Map<String, Object> rumtek = new HashMap<>();
        rumtek.put("id", 1);
        rumtek.put("name", "Rumtek Monastery");
        rumtek.put("nameNepali", "रुम्तेक गुम्बा");
        rumtek.put("description", "The largest monastery in Sikkim and seat of the Karmapa lineage, featuring stunning architecture and spiritual significance.");
        rumtek.put("descriptionNepali", "सिक्किमको सबैभन्दा ठूलो गुम्बा र कर्मपा वंशको सिट, मनमोहक वास्तुकला र आध्यात्मिक महत्वको साथ।");
        rumtek.put("latitude", 27.3019);
        rumtek.put("longitude", 88.5606);
        rumtek.put("address", "Rumtek, Sikkim 737135");
        rumtek.put("founded", "1960s");
        rumtek.put("significance", "Seat of the Karmapa lineage, center of Tibetan Buddhism");
        rumtek.put("features", Arrays.asList("Golden stupa", "Prayer wheels", "Monk quarters", "Assembly hall"));
        rumtek.put("image", "/rumtek-monastery-golden-roof-traditional-architect.jpg");
        monasteries.add(rumtek);
        
        Map<String, Object> pemayangtse = new HashMap<>();
        pemayangtse.put("id", 2);
        pemayangtse.put("name", "Pemayangtse Monastery");
        pemayangtse.put("nameNepali", "पेमायाङ्त्से गुम्बा");
        pemayangtse.put("description", "One of the oldest monasteries in Sikkim, known for its ancient murals and traditional architecture.");
        pemayangtse.put("descriptionNepali", "सिक्किमको सबैभन्दा पुरानो गुम्बाहरू मध्ये एक, प्राचीन भित्ति चित्रहरू र पारम्परिक वास्तुकलाको लागि प्रसिद्ध।");
        pemayangtse.put("latitude", 27.3167);
        pemayangtse.put("longitude", 88.2500);
        pemayangtse.put("address", "Pemayangtse, Sikkim 737111");
        pemayangtse.put("founded", "1705");
        pemayangtse.put("significance", "Ancient monastery with historical murals and artifacts");
        pemayangtse.put("features", Arrays.asList("Ancient murals", "Traditional architecture", "Prayer hall", "Monk cells"));
        pemayangtse.put("image", "/pemayangtse-monastery-white-walls-mountain-view.jpg");
        monasteries.add(pemayangtse);
        
        return ResponseEntity.ok(monasteries);
    }
    
    @GetMapping("/api/festivals")
    public ResponseEntity<List<Map<String, Object>>> getFestivals() {
        List<Map<String, Object>> festivals = new ArrayList<>();
        
        Map<String, Object> losar = new HashMap<>();
        losar.put("id", 1);
        losar.put("name", "Losar Festival");
        losar.put("nameNepali", "लोसार पर्व");
        losar.put("date", "2025-02-10");
        losar.put("description", "Tibetan New Year celebration marking the beginning of the lunar year with traditional ceremonies, prayers, and cultural performances.");
        losar.put("descriptionNepali", "तिब्बती नयाँ वर्षको उत्सव जुन चन्द्र वर्षको सुरुवातलाई चिन्हित गर्छ पारम्परिक समारोह, प्रार्थना र सांस्कृतिक प्रदर्शनहरूसहित।");
        losar.put("location", "All Monasteries");
        losar.put("duration", "3 days");
        losar.put("significance", "New Year celebration, purification rituals, and community gathering");
        losar.put("image", "/rumtek-monastery-golden-roof-traditional-architect.jpg");
        festivals.add(losar);
        
        Map<String, Object> sagaDawa = new HashMap<>();
        sagaDawa.put("id", 2);
        sagaDawa.put("name", "Saga Dawa Festival");
        sagaDawa.put("nameNepali", "सगा दावा पर्व");
        sagaDawa.put("date", "2025-05-23");
        sagaDawa.put("description", "Sacred festival commemorating Buddha's birth, enlightenment, and parinirvana with special prayers, circumambulation, and merit-making activities.");
        sagaDawa.put("descriptionNepali", "बुद्धको जन्म, ज्ञानोदय र परिनिर्वाणको स्मरण गर्ने पवित्र पर्व, विशेष प्रार्थना, परिक्रमा र पुण्य कार्यहरूसहित।");
        sagaDawa.put("location", "Pemayangtse Monastery");
        sagaDawa.put("duration", "1 day");
        sagaDawa.put("significance", "Triple celebration of Buddha's major life events");
        sagaDawa.put("image", "/majestic-himalayan-monastery-with-prayer-flags-and.jpg");
        festivals.add(sagaDawa);
        
        // Spring Meditation Retreat
        Map<String, Object> meditationRetreat = new HashMap<>();
        meditationRetreat.put("id", 3);
        meditationRetreat.put("name", "Spring Meditation Retreat");
        meditationRetreat.put("nameNepali", "वसन्त ध्यान शिविर");
        meditationRetreat.put("date", "2025-03-15");
        meditationRetreat.put("description", "7-day silent meditation retreat focusing on mindfulness and inner peace, led by experienced monks.");
        meditationRetreat.put("descriptionNepali", "सचेतनता र आन्तरिक शान्तिमा केन्द्रित ७ दिनको मौन ध्यान शिविर, अनुभवी भिक्षुहरूद्वारा निर्देशित।");
        meditationRetreat.put("location", "Tashiding Monastery");
        meditationRetreat.put("duration", "7 days");
        meditationRetreat.put("significance", "Deep spiritual practice and self-discovery");
        meditationRetreat.put("image", "/tashiding-monastery-hilltop-prayer-flags-valley-vi.jpg");
        festivals.add(meditationRetreat);
        
        // Weekly Puja Ceremony
        Map<String, Object> pujaCeremony = new HashMap<>();
        pujaCeremony.put("id", 4);
        pujaCeremony.put("name", "Weekly Puja Ceremony");
        pujaCeremony.put("nameNepali", "साप्ताहिक पूजा समारोह");
        pujaCeremony.put("date", "2025-01-07");
        pujaCeremony.put("description", "Traditional prayer ceremony held every Sunday with chanting, offerings, and community participation.");
        pujaCeremony.put("descriptionNepali", "हरेक आइतबार आयोजना हुने पारम्परिक प्रार्थना समारोह, मन्त्र पाठ, बलि र सामुदायिक सहभागितासहित।");
        pujaCeremony.put("location", "Enchey Monastery");
        pujaCeremony.put("duration", "2 hours");
        pujaCeremony.put("significance", "Regular spiritual practice and community bonding");
        pujaCeremony.put("image", "/pemayangtse-monastery-white-walls-mountain-view.jpg");
        festivals.add(pujaCeremony);
        
        // Monthly Dharma Teaching
        Map<String, Object> dharmaTeaching = new HashMap<>();
        dharmaTeaching.put("id", 5);
        dharmaTeaching.put("name", "Monthly Dharma Teaching");
        dharmaTeaching.put("nameNepali", "मासिक धर्म शिक्षा");
        dharmaTeaching.put("date", "2025-01-15");
        dharmaTeaching.put("description", "Monthly teachings on Buddhist philosophy and practice by senior monks, open to all seekers.");
        dharmaTeaching.put("descriptionNepali", "वरिष्ठ भिक्षुहरूद्वारा बौद्ध दर्शन र अभ्यासमा मासिक शिक्षा, सबै खोजीहरूका लागि खुला।");
        dharmaTeaching.put("location", "Dubdi Monastery");
        dharmaTeaching.put("duration", "2 hours");
        dharmaTeaching.put("significance", "Education and spiritual guidance");
        dharmaTeaching.put("image", "/majestic-himalayan-monastery-with-prayer-flags-and.jpg");
        festivals.add(dharmaTeaching);
        
        // Bumchu Festival
        Map<String, Object> bumchu = new HashMap<>();
        bumchu.put("id", 6);
        bumchu.put("name", "Bumchu Festival");
        bumchu.put("nameNepali", "बुम्चु पर्व");
        bumchu.put("date", "2025-02-24");
        bumchu.put("description", "Sacred water festival with the opening of the holy water vase, predicting the year's fortune and weather.");
        bumchu.put("descriptionNepali", "पवित्र जल पर्व जसमा पवित्र जल भाँडो खोलिन्छ, वर्षको भाग्य र मौसमको भविष्यवाणी गर्न।");
        bumchu.put("location", "Tashiding Monastery");
        bumchu.put("duration", "1 day");
        bumchu.put("significance", "Divination and blessing ceremony");
        bumchu.put("image", "/tashiding-monastery-hilltop-prayer-flags-valley-vi.jpg");
        festivals.add(bumchu);
        
        // Guru Rinpoche Day
        Map<String, Object> guruRinpoche = new HashMap<>();
        guruRinpoche.put("id", 7);
        guruRinpoche.put("name", "Guru Rinpoche Day");
        guruRinpoche.put("nameNepali", "गुरु रिन्पोचे दिवस");
        guruRinpoche.put("date", "2025-07-21");
        guruRinpoche.put("description", "Celebration of Guru Padmasambhava's birth with special prayers, dances, and offerings.");
        guruRinpoche.put("descriptionNepali", "गुरु पद्मसम्भवको जन्मको उत्सव, विशेष प्रार्थना, नृत्य र बलिसहित।");
        guruRinpoche.put("location", "All Monasteries");
        guruRinpoche.put("duration", "1 day");
        guruRinpoche.put("significance", "Honoring the founder of Tibetan Buddhism");
        guruRinpoche.put("image", "/rumtek-monastery-golden-roof-traditional-architect.jpg");
        festivals.add(guruRinpoche);
        
        // Lhabab Duchen
        Map<String, Object> lhababDuchen = new HashMap<>();
        lhababDuchen.put("id", 8);
        lhababDuchen.put("name", "Lhabab Duchen");
        lhababDuchen.put("nameNepali", "ल्हाबाब दुचेन");
        lhababDuchen.put("date", "2025-11-15");
        lhababDuchen.put("description", "Celebration of Buddha's descent from heaven, marked by special prayers and merit-making activities.");
        lhababDuchen.put("descriptionNepali", "बुद्धको स्वर्गबाट अवतरणको उत्सव, विशेष प्रार्थना र पुण्य कार्यहरूद्वारा चिन्हित।");
        lhababDuchen.put("location", "All Monasteries");
        lhababDuchen.put("duration", "1 day");
        lhababDuchen.put("significance", "Commemorating Buddha's return to earth");
        lhababDuchen.put("image", "/majestic-himalayan-monastery-with-prayer-flags-and.jpg");
        festivals.add(lhababDuchen);
        
        // Winter Retreat
        Map<String, Object> winterRetreat = new HashMap<>();
        winterRetreat.put("id", 9);
        winterRetreat.put("name", "Winter Meditation Retreat");
        winterRetreat.put("nameNepali", "जाडो ध्यान शिविर");
        winterRetreat.put("date", "2025-12-01");
        winterRetreat.put("description", "Intensive 10-day meditation retreat during the winter months for advanced practitioners.");
        winterRetreat.put("descriptionNepali", "जाडो महिनाहरूमा उन्नत अभ्यासकर्ताहरूका लागि गहन १० दिनको ध्यान शिविर।");
        winterRetreat.put("location", "Rumtek Monastery");
        winterRetreat.put("duration", "10 days");
        winterRetreat.put("significance", "Advanced spiritual practice");
        winterRetreat.put("image", "/rumtek-monastery-golden-roof-traditional-architect.jpg");
        festivals.add(winterRetreat);
        
        // New Year Blessing Ceremony
        Map<String, Object> newYearBlessing = new HashMap<>();
        newYearBlessing.put("id", 10);
        newYearBlessing.put("name", "New Year Blessing Ceremony");
        newYearBlessing.put("nameNepali", "नयाँ वर्ष आशीर्वाद समारोह");
        newYearBlessing.put("date", "2025-01-01");
        newYearBlessing.put("description", "Special blessing ceremony for the new year with prayers for peace, prosperity, and good health.");
        newYearBlessing.put("descriptionNepali", "नयाँ वर्षका लागि विशेष आशीर्वाद समारोह, शान्ति, समृद्धि र राम्रो स्वास्थ्यका लागि प्रार्थनासहित।");
        newYearBlessing.put("location", "All Monasteries");
        newYearBlessing.put("duration", "3 hours");
        newYearBlessing.put("significance", "New year blessings and purification");
        newYearBlessing.put("image", "/pemayangtse-monastery-white-walls-mountain-view.jpg");
        festivals.add(newYearBlessing);
        
        return ResponseEntity.ok(festivals);
    }
    
    @GetMapping("/api/archives")
    public ResponseEntity<List<Map<String, Object>>> getArchives() {
        List<Map<String, Object>> archives = new ArrayList<>();
        
        // Buddhist Thangka Paintings
        Map<String, Object> thangka = new HashMap<>();
        thangka.put("id", 1);
        thangka.put("title", "Buddhist Thangka Paintings");
        thangka.put("titleNepali", "बौद्ध थाङ्का चित्रहरू");
        thangka.put("description", "Traditional Tibetan Buddhist scroll paintings depicting deities, mandalas, and religious scenes. These intricate artworks serve as meditation aids and religious teaching tools.");
        thangka.put("descriptionNepali", "पारम्परिक तिब्बती बौद्ध स्क्रोल चित्रहरू जुन देवताहरू, मण्डलहरू र धार्मिक दृश्यहरू चित्रण गर्छन्। यी जटिल कलाकृतिहरू ध्यान सहायक र धार्मिक शिक्षण उपकरणको रूपमा काम गर्छन्।");
        thangka.put("category", "Art");
        thangka.put("period", "17th-19th Century");
        thangka.put("location", "Rumtek Monastery");
        thangka.put("significance", "Religious art and meditation aids");
        thangka.put("image", "/rumtek-monastery-golden-roof-traditional-architect.jpg");
        archives.add(thangka);
        
        // Ancient Buddhist Manuscripts
        Map<String, Object> manuscripts = new HashMap<>();
        manuscripts.put("id", 2);
        manuscripts.put("title", "Ancient Buddhist Manuscripts");
        manuscripts.put("titleNepali", "प्राचीन बौद्ध पाण्डुलिपिहरू");
        manuscripts.put("description", "Handwritten Buddhist texts and scriptures preserved in monasteries, containing teachings, prayers, and philosophical discourses from ancient times.");
        manuscripts.put("descriptionNepali", "गुम्बाहरूमा संरक्षित हस्तलिखित बौद्ध ग्रन्थ र धर्मशास्त्रहरू, प्राचीन कालका शिक्षा, प्रार्थना र दार्शनिक प्रवचनहरू समावेश गर्छन्।");
        manuscripts.put("category", "Literature");
        manuscripts.put("period", "12th-18th Century");
        manuscripts.put("location", "Pemayangtse Monastery");
        manuscripts.put("significance", "Preservation of Buddhist teachings and philosophy");
        manuscripts.put("image", "/pemayangtse-monastery-white-walls-mountain-view.jpg");
        archives.add(manuscripts);
        
        // Prayer Wheels and Ritual Objects
        Map<String, Object> prayerWheels = new HashMap<>();
        prayerWheels.put("id", 3);
        prayerWheels.put("title", "Prayer Wheels and Ritual Objects");
        prayerWheels.put("titleNepali", "प्रार्थना चक्र र अनुष्ठानिक वस्तुहरू");
        prayerWheels.put("description", "Sacred ritual objects including prayer wheels, bells, dorjes, and other ceremonial items used in Buddhist practices and ceremonies.");
        prayerWheels.put("descriptionNepali", "पवित्र अनुष्ठानिक वस्तुहरू जसमा प्रार्थना चक्र, घण्टी, दोर्जे र अन्य समारोहिक वस्तुहरू समावेश छन् जुन बौद्ध अभ्यास र समारोहहरूमा प्रयोग हुन्छन्।");
        prayerWheels.put("category", "Artifacts");
        prayerWheels.put("period", "15th-20th Century");
        prayerWheels.put("location", "Tashiding Monastery");
        prayerWheels.put("significance", "Ritual and ceremonial importance in Buddhist practice");
        prayerWheels.put("image", "/tashiding-monastery-hilltop-prayer-flags-valley-vi.jpg");
        archives.add(prayerWheels);
        
        // Monastery Architecture Plans
        Map<String, Object> architecture = new HashMap<>();
        architecture.put("id", 4);
        architecture.put("title", "Monastery Architecture Plans");
        architecture.put("titleNepali", "गुम्बा वास्तुकला योजनाहरू");
        architecture.put("description", "Historical architectural drawings and plans of monastery buildings, showing traditional Tibetan Buddhist architectural styles and construction techniques.");
        architecture.put("descriptionNepali", "गुम्बा भवनहरूका ऐतिहासिक वास्तुकला चित्र र योजनाहरू, पारम्परिक तिब्बती बौद्ध वास्तुकला शैली र निर्माण तकनीकहरू देखाउँछन्।");
        architecture.put("category", "Art");
        architecture.put("period", "16th-19th Century");
        architecture.put("location", "All Monasteries");
        architecture.put("significance", "Historical architectural documentation");
        architecture.put("image", "/majestic-himalayan-monastery-with-prayer-flags-and.jpg");
        archives.add(architecture);
        
        // Buddhist Statues and Sculptures
        Map<String, Object> statues = new HashMap<>();
        statues.put("id", 5);
        statues.put("title", "Buddhist Statues and Sculptures");
        statues.put("titleNepali", "बौद्ध मूर्तिहरू र मूर्तिकलाहरू");
        statues.put("description", "Sacred Buddhist statues and sculptures made from various materials including bronze, wood, and stone, representing different Buddhas and deities.");
        statues.put("descriptionNepali", "विभिन्न सामग्रीहरू जस्तै कांस्य, काठ र ढुङ्गाबाट बनेका पवित्र बौद्ध मूर्तिहरू र मूर्तिकलाहरू, विभिन्न बुद्ध र देवताहरूको प्रतिनिधित्व गर्छन्।");
        statues.put("category", "Art");
        statues.put("period", "14th-20th Century");
        statues.put("location", "Rumtek Monastery");
        statues.put("significance", "Religious and artistic heritage");
        statues.put("image", "/rumtek-monastery-golden-roof-traditional-architect.jpg");
        archives.add(statues);
        
        // Traditional Musical Instruments
        Map<String, Object> instruments = new HashMap<>();
        instruments.put("id", 6);
        instruments.put("title", "Traditional Musical Instruments");
        instruments.put("titleNepali", "पारम्परिक संगीत वाद्यहरू");
        instruments.put("description", "Traditional Tibetan musical instruments used in religious ceremonies and cultural performances, including drums, horns, and cymbals.");
        instruments.put("descriptionNepali", "धार्मिक समारोह र सांस्कृतिक प्रदर्शनहरूमा प्रयोग हुने पारम्परिक तिब्बती संगीत वाद्यहरू, जसमा ढोल, सिङ र झ्यालहरू समावेश छन्।");
        instruments.put("category", "Artifacts");
        instruments.put("period", "18th-20th Century");
        instruments.put("location", "Pemayangtse Monastery");
        instruments.put("significance", "Cultural and ceremonial music heritage");
        instruments.put("image", "/pemayangtse-monastery-white-walls-mountain-view.jpg");
        archives.add(instruments);
        
        return ResponseEntity.ok(archives);
    }
    
    @GetMapping("/api/search")
    public ResponseEntity<Map<String, Object>> search(@RequestParam String q) {
        Map<String, Object> results = new HashMap<>();
        results.put("query", q);
        results.put("monasteries", new ArrayList<>());
        results.put("festivals", new ArrayList<>());
        results.put("archives", new ArrayList<>());
        results.put("totalResults", 0);
        
        // Simple search logic for "Losar Festival"
        if (q.toLowerCase().contains("losar") || q.toLowerCase().contains("festival")) {
            List<Map<String, Object>> festivals = new ArrayList<>();
            Map<String, Object> losar = new HashMap<>();
            losar.put("id", 1);
            losar.put("name", "Losar Festival");
            losar.put("nameNepali", "लोसार पर्व");
            losar.put("date", "2025-02-10");
            losar.put("description", "Tibetan New Year celebration marking the beginning of the lunar year with traditional ceremonies, prayers, and cultural performances.");
            losar.put("descriptionNepali", "तिब्बती नयाँ वर्षको उत्सव जुन चन्द्र वर्षको सुरुवातलाई चिन्हित गर्छ पारम्परिक समारोह, प्रार्थना र सांस्कृतिक प्रदर्शनहरूसहित।");
            losar.put("location", "All Monasteries");
            losar.put("duration", "3 days");
            losar.put("significance", "New Year celebration, purification rituals, and community gathering");
            losar.put("image", "/rumtek-monastery-golden-roof-traditional-architect.jpg");
            festivals.add(losar);
            results.put("festivals", festivals);
            results.put("totalResults", 1);
        }
        
        return ResponseEntity.ok(results);
    }
}
