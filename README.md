![](media/image1.png)

Umetna inteligenca
 2\. seminarska naloga

> Mentor: asist. dr. Petar Vračar in
> asist. dr. Tome Eftimov

Datum: 6.1.2023 
Avtorja: Urh Jamšek, Blaž Mikec

# Kazalo
- [Uvod](#uvod)
- [Vizualizacija](#vizualizacija)
- [Opis algoritmov](#opis-algoritmov)
  - [Generiranje množice naslednjih korakov](#generiranje-mno%C5%BEice-naslednjih-korakov)
  - [BFS](#bfs)
  - [DFS](#dfs)
  - [IDDFS](#iddfs)
  - [A\*](#a)
  - [IDA\*](#ida)
  - [Hevristika](#hevristika)
- [Algorithmi na primerih](#algorithmi-na-primerih)
  - [Primer 0](#primer-0)
  - [Primer 1](#primer-1)
  - [Primer 2](#primer-2)
  - [Primer 3](#primer-3)
  - [Primer 4](#primer-4)
  - [Primer 5](#primer-5)
- [Zaključek](#zaključek)


# Uvod

Pri drugi seminarski nalogo predmeta umetna inteligenca smo morali
implementirati in uporabiti preiskovalne algoritme na domeni
robotiziranega skladišča. Skladišče vsebuje škatle, ki so lahko na kupu
ali pa na tleh. Robotska roka lahko vzame najbolj zgorno škatlo stolpca
ter ga premakne na kateri koli drugi stolpec. Upravljalec robotske roke
prejme začetno in končno konfiguracije skladišča, nato pa mora poiskati
čim krajpe zaporedje ukazov, s katerimi bo robotska roka preuredila
škatle na zahtevani način. Pri tej seminarski nalogi sva implementirala
BFS, DFS, IDDFS, A\* in IDA\*. Odličila sva se izdelati spletno stran
ter implementirati iskalne algoritme v programskem jeziku javaScript.

# Vizualizacija

Ob začetku te seminarske naloge sva se odločila kreirati spletno stran,
saj sva menila da tako najboljše vizualizírati delovanje in prikaz
dobljenih rezultatov iskalnih algorithmov.

![](media/image34.png)

Na levi strani splene strani se nahaja grafični vmesnik, kjer lahko
izbereš primer ter iskalni algorithme. S klikom na gumb Search bo pognal
izbrani iskalni algorithem. Obroba gumba Search se lahko obrava zeleno
ali rdeče glede na ali je iskalni algorithem našel ustrezno pot iz
začetne do končne konfiguracije. Ko se iskalni algorithem uspešno
izvede, lahko vidimo najdeno pot levo spodaj. Če želimo prikaz po
premikih od začente do končne konfiguracije, lahko pritisnimo gumb
Display. Ob gumbu Display imava tudi vrednost ti določa hitrost izrisa.
Manjša kot je vrednost hitreje se izrisuje pot. Grafični vmesnik vsebuje
tudi nekaj statističnih podatkov kot je čas, ki ga je iskalni algorithem
potreboval, da je vrnil rezultat. Pod dobljeno pot pa imava tudi gumb
Clear path. Ta gumb pregleda vrnjeno pot ter poišče nepotrebne premike
ter jih odstrani tako da optimizira dobljeno pot.

# Opis algoritmov

## Generiranje množice naslednjih korakov

Vsi sledeči algoritmi so implrementirani tako, da za vsako vozlišče (oz.
stanje v skladišču) sproti generiramo množico naslednjih potez. To
storimo tako, da z dvema števcema "i" in "j" v intervalu 0 do "število
stolpcev v skladišču", generiramo vsako permutacijo premikov, kjer "i"
predstavlja stolpec iz katerega vzamemo škatlo in jo odložimo na j-ti
stolpec.

Ker seveda nočemo, da nastanejo napake, lahko že tu izločimo nekatere
možnosti:

-   če sta "i" in "j" enaka, se premik efektivno ne zgodi,

-   če je "i"-ti stolpec prazen,

-   če je "j"-ti stolpec poven.

Hkrati pa beleživa že obiskana stanja, kar izloči možnost ciklanja.

## BFS

BFS (Breath-First Search, slo.: Iskanje v širino) je neinformirani
iskalni algoritem. Kar pomeni, da obišče vsa vozlišča, pri tem pa ne
uporablja nobenih dodatnih informacij za izbiranje naslednjega vozlišča.
Pri tem algoritmu se premikamo od vozlišča do vozliča po nivojih drevesa
in obdelamo vsa vozlišča v nivoju preden se pomaknemo na naslednjega.

## DFS

DFS (Depth-First Search, slo.: Iskanje v globino) je iskalni algoritem,
pri katerem se najprej poglabljamo v posameznega otroka vozlišča, ga
rekurzivno obdelamo in se postopoma vračamo nazaj in obdelujemo
preostale otroke. To pomeni, da bomo najprej obdelali vse vozlišče v
globino, preden se vrnemo na svojo raven in obdelamo še preostale
vozlišče na tej ravni. DFS je primeren za reševanje problemov, kjer je
cilj najti kakšno pot v grafu ali drevesu. Algoritem ne nujno najde
optimalne rešitve.

## IDDFS

IDDFS (Itertive Deppening Depth-First Searh) je varianta DFS (iskanje v
gobino) algoritma, ki ga uporabljamo za reševanje problemov. Pri tem
algoritmu efektivno večkrat izvedemo iskanje v globino pri čemer vsakič
omejimo globino iskanja. Ob primeru, da vozlišče ni bilo najdemo,
povečamo omejitev. Algoritem vedno najde optimalno rešitev.

## A\*

A\* (A-star) je informirani iskalni algoritem, pri katerem podamo
hevristiko, za izbiranje naslednjega vozlišča. A\* vzlišču z najbolje
ocenjenim F score-om (hevrisika + cena poti) razvije naslednja vozlišča.
To ponavljamo dokler ne najdemo končnega vozlišča. Ta algoritem je zelo
popularen za reševanje problemov z iskanjem poti, kot so navigacije,
računalniške igrice, robotika, itd...

## IDA\*

Algoritem IDA\* (Iterative deepening A\*) je zelo podoben A\*, kateremu
se razlikuje v tem, da shranjuje le mejo F-score-a namesto vseh vozlišč,
kar je zelo potratno z pomnilnikom. V tem pa je ta algoritem zelo
podobem IDDFS, ki tudi uporablja mejo. Ta algoritem je učinkovit za
reševanje problemov, ki zahtevajo globoko preiskovanje grafa, saj porabi
manj pomnilnika. Je pa kljub temu manj učinkovit kot A\*.

## Hevristika

Za hevristiko pri algoritmih A\* in IDA\* sva imela veliko idej. V
prvotni ideji sva za vsako škatlo izračunala premik po x-osi (premik med
stolpci), a sva ugotovila, da ta rešitev ni naj boljša. Zato sva dodala
kazenjske točke. V primeru, da je izhodni in ciljni stolpec enak, torej
škatla ostane v istem stolpcu, še prišteje po 2 kazenjski točki za
razliko v y-osi. 2 točki se prišteje saj sva predpostavila, da je treba
element odstraniti in kasneje dodati nazaj, kar vzame vsaj 2 premika.
Zelo pomembna stvar pa je tudi, da se pozicija po y-osi štejejo od
spodaj na vzgor in ne obratno, saj ta deluje kot stack ali sklad.

# Algorithmi na primerih

Pri drugi seminarski nalogi, smo dobili 5 različnih primerov za
testiranje iskalnih algorithmov.

## Primer 0

Primer 0, sva dodala midva. Na začetku izdelave algorithmov, sva
potrebovala enostaven primer, za testiranje ali algorithem deluje.

![](media/image7.gif)

<img src="media/image2.png" alt="Image 2" width="33%"> <img src="media/image20.png" alt="Image 20" width="33%"> <img src="media/image5.png" alt="Image 5" width="33%">
<img src="media/image11.png" alt="Image 11" width="33%"> <img src="media/image35.png" alt="Image 35" width="33%">

## Primer 1

![](media/image23.gif)

<img src="media/image15.png" alt="Image 15" width="33%"> <img src="media/image12.png" alt="Image 12" width="33%"> <img src="media/image4.png" alt="Image 4" width="33%">
<img src="media/image25.png" alt="Image 25" width="33%"> <img src="media/image38.png" alt="Image 38" width="33%">

## Primer 2

![](media/image6.gif)

<img src="media/image14.png" alt="Image 14" width="33%"> <img src="media/image21.png" alt="Image 21" width="33%"> <img src="media/image29.png" alt="Image 29" width="33%">
<img src="media/image18.png" alt="Image 18" width="33%"> <img src="media/image19.png" alt="Image 19" width="33%">

## Primer 3

![](media/image3.gif)

<img src="media/image31.png" alt="Image 31" width="33%"> <img src="media/image33.png" alt="Image 33" width="33%"> <img src="media/image26.png" alt="Image 26" width="33%">
<img src="media/image16.png" alt="Image 16" width="33%"> <img src="media/image30.png" alt="Image 30" width="33%">

## Primer 4

![](media/image9.gif)

<img src="media/image10.png" alt="Image 10" width="33%"> <img src="media/image37.png" alt="Image 37" width="33%"> <img src="media/image27.png" alt="Image 27" width="33%">
<img src="media/image32.png" alt="Image 32" width="33%"> <img src="media/image24.png" alt="Image 24" width="33%">

## Primer 5

![](media/image13.gif)

<img src="media/image8.png" alt="Image 8" width="33%"> <img src="media/image22.png" alt="Image 22" width="33%"> <img src="media/image17.png" alt="Image 17" width="33%">
<img src="media/image36.png" alt="Image 36" width="33%"> <img src="media/image28.png" alt="Image 28" width="33%">


# Zaključek

Med izdelovanjem seminarske naloge sva ugotovila veliko stvari.

Pri izdelavi spletne strani in vizualizaciji rezultatov iskalnih
algorithmov sva poznala, kako se vsak algorithem razlikuje ter njihove
prednosti in slabosti pri uporabi ter izdelavi. Pri prikazovanju
rezultatov sva želela bit čim bolj kreativna, zato sva dodala animacijo
poti vsakega algorithma. Za lažjo primerjavo sva pa še dodala začetno in
končno stanje, da uporabnik lažje razbere delovanje.

Pri implementaciji in testiranju vseh iskalnih algorithmov sva opazila,
da algorithma A\* in IDA\* sta daleč najhitrejša pri izvedbi ter njune
rešitve so vedno krajše v primerjavi z ostalimi algorithmi. Med slabšimi
algorithmi pri tej nalogi pa je algorithem DFS. Poskusila sva tudi
izdelati genetski algorithem, ampak zaradi kompleksnosti nama to ni
uspelo.
