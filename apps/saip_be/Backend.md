# Backend
Adresár **saip_be** obsahuje niekoľko ďalších adresárov, ktoré sa vzťahujú na databázu, modely a samotný backend.
- **saip_be** obsahuje všeobecné nastavenia backendu, informácie o frameworku a pod.
- **saip_api** 
    - v roote sa nachádzajú databázové modely, serializéry pre requesty, informácie o adminoch a pod.
    - v adresári **views** sa už nachádza samotné **REST API**
- **saip_simulation**
- **simulation_testing**

## Opis modelov (súbor saip_api/models.py)
Súbor obsahuje databázove modely v ORM štýle.
Relačná tabuľka je dostupná na : https://dbdiagram.io/d/simulation-6353f5ad4709410195bb7afb


### Modely týkajúce sa samotnej hry:

**Game**
 - model opisuje konkrétnu hru z vyššieho pohľadu
 - opis atribútov v modeli:
    Atribút | Význam 
    | --- | --- |
    **start** | kedy sa hra začala
    **end** | kedy hra skončila
    **name** | názov hry
    **admin** | kto bol adminov danej hry(daný používateľ musí mať rolu **is_staff**)
    **turns** | koľko ma daná hra kôl
    **parameters** | FK na parametre

**Game parameters**
 - model opisuje vlastnosti pre konkrétnu hru
 - opis atribútov v 
    Atribút | Význam 
    | --- | --- |
    **budget_cap** | základný rozpočet
    **deprecation** | odpisy v percentách **not sure**
    **base_man_cost** | cena za rozšírenie firmy **not sure**
    **end_turn_on_committed** | hovorí o tom, že kolo sa automaticky ukončí, ak všetky tímy dokončili svoj ťah

**Turn**
 - model opisuje konkrétne kolo pre konkrétnu hru
 - opis atribútov v modeli:
     Atribút | Význam 
    | --- | --- |
    **number** | číslo daného kola
    **start** | kedy dané kolo začalo
    **end** | kedy dané kolo skončilo
    **game** | k akej hre sa kolo vzťahuje


### Modely týkajúce sa založenia/manažovania firiem:

**Company**
 - model opisuje vytvorenú spoločnosť
 - opis atribútov v modeli:
    | Atribút | Význam |
    | --- | --- |
    | **name** | názov spoločnosti
    | **user** | akým používateľom bola spoločnosť vytvorená
    | **game** | do akej konkrétnej hry spoločnosť patrí
    | **participants** | zoznam účastníkov na danej spoločnosti, zapisane vo forme poľa, napr. ["Adam", "Jakub"] ...

**CompaniesState**
 - model reprezentuje aktuálny stav spoločnosti v každom kole
 - opis atribútov v modeli:
    | Atribút | Význam |
    | --- | --- |
    | **company** | spoločnosť, ku ktorej sa stav viaže
    | **turn** | kolo, na ktoré sa stav viaže
    | **production** | // FK na production
    | **factory** | // FK na factory
    | **stock_price** | hodnota jednej akcie
    | **inventory** | zásoby
    | **r_d** | náklady na výskum a vývoj
    | **marketing** | koľko bolo investované do marketingu // FK na marketing
    | **commited** | či už spoločnosť ukončila kolo
    | **orders_received** | počet prijatých objednávok
    | **orders_fulfilled** | počet splnených objednávok
    | **cash** | dostupný budget (každé kolo je default 10000)
    | **ret_earnings** |

**Production**
- model reprezentuje údaje o výrobe
    | Atribút | Význam |
    | --- | --- |
    | **man_cost** | variabilné náklady |
    | **man_cost_all** | celkové náklady |
    | **sell_price** | predajná cena |
    | **volume** | vyrobené množstvo |

**Marketing**
- model reprezentuje informácie o tom, koľko bolo invenstovaných peňazí do jednotlivých druhov marketingu
    | Atribút | 
    | --- |  
    **viral** | 
    **podcast** | 
    **ooh** | 
    **tv** | 
    **billboard** | 


**Upgrade**
- model popisuje informácie o jednotlivých druhoch vylepšení
    | Atribút | Význam |
    | --- | --- |
    **cost** | cena vylepšenia
    **sales_effect** | vplyv na predaj (float 0-1)
    **man_cost_effect** | vplyv na vyrobnú cenu (float 0-1)
    **name** | názov
    **camera_pos** | random info o pozícii
    **camera_rot** | random info o pozícii
    **description** | popis

**Factory**
-  model reprezentuje informácie o výrobe
    | Atribút | Význam |
    | --- | --- |
    **capacity** | výrobná kapacita
    **base_cost** | **not used**
    **capital** | výdavky na rozhodnutia
    **capital_investments** | kapitálové investície

**MarketState**
- model reprezentuje informácie o trhu
    | Atribút | Význam |
    | --- | --- |
    **turn** | FK na ťah
    **sold** | celkovo predaných položiek na trhu
    **demand** | celkový dopyt na trhu
    **inventory** | celkové zásoby na trhu
    **manufactured** | celkový počet vyrobených kusov na trhu
    **capacity** | celková výrobná kapacita spoločností na trhu

**Inventory**
- model reprezentujúci informácie o zásobách spoločnosti
    | Atribút | Význam |
    | --- | --- |
    **company** | FK na spoločnosť
    **unit_count** | počet kusov
    **price_per_unit** | cena za kus
    **turn_num** | číslo kola

**TeacherDecisions**
- model reprezentujúci dotatočné informácie o trhu a limitoch
    | Atribút | Význam |
    | --- | --- |
    **turn** | FK na ťah
    **interest_rate** | úroková sadzba
    **tax_rate** | daň
    **inflation** | miera inflácie
    **loan_limit** | pôžičkový limit

### views
 - jednotlivé HTTP REST rozhrania, ktoré sa volajú z frontendu
 - rozdelené do jednotlivých súborov podľa logiky začlenenia

  
<br/><br/>
# Prihlasovanie / user management
Prihlasovanie prebieha vo view **views/UserManagement/LoginView**, ktorý používa interný serializér **AuthTokenSerializer**

    - používajú sa **django.contrib.auth** a **django.contrib.contenttypes** v INSTALLED_APPS
a **django.contrib.auth.middleware.AuthenticationMiddleware** v MIDDLEWARE
    - je použitá **KNOX** tokej autentifikácia, ktorá ma limit tokenov pre používateľa

<br/><br/>
#  Na udržovanie sessions sa používa **'django.contrib.sessions** v INSTALLED_APPS spolu s 
**django.contrib.sessions.middleware.SessionMiddleware** v MIDDLEWARE


<br></br>

# Django používa koncept VIEWS, ktoré zoberú request a vrátia response
    - v našom projekte používame Class-based views
        - **PermissionRequiredMixin** sú použité na mieste, kde sa robí autorizácia, ako napr. v **EndTurnView**
        - **mixins** sú malé časti kódu, ktoré pridávajú funkcionalitu ku konkrétnej triede

