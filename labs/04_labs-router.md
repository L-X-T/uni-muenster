# Angular Workshop: Routing

- [Angular Workshop: Routing](#Angular-Workshop-Routing)
  - [Routing implementieren](#Routing-implementieren)
  - [Bonus: Routen im Hash-Fragment und Tracing *](#Bonus-Routen-im-Hash-Fragment-und-Tracing)
  - [Bonus: Programmatisches Routing *](#Bonus-Programmatisches-Routing)

## Routing implementieren

In dieser Übung werden Sie die folgende Menüstruktur mit Routing implementieren:

```
   AppComponent
      +----------- HomeComponent
      +----------- FlightSearchComponent
      +----------- PassengerSearchComponent (Dummy)
```

Dabei wird folgendes Muster berücksichtigt:

- Die ``AppComponent`` und ``HomeComponent`` sind Teil des ``AppModules`` 
- Die anderen beiden Komponenten sind Teil des ``FlightBookingModules``
- Jedes Modul bekommt seine eigene Routen-Konfiguration mit ``forRoot`` bzw. ``forChild`` zugewiesen.

Falls Sie möchten, leiten Sie die folgenden Punkte durch die Übung:

1. Fügen Sie die folgenden zusätzlichen (Dummy-)Komponenten, welche als Routing-Ziele dienen sollen, hinzu:
	- HomeComponent (Ordner ``src/app/home``)
	- PassengerSearchComponent (Order ``src/app/flight-booking/passenger-search``)

2. Stellen Sie sicher, dass die neue HomeComponent beim ``AppModule`` registriert ist.

3. Stellen Sie sicher, dass die neue ``PassengerSearchComponent`` beim ``FlightBookingModule`` registriert ist.

4. Erstellen Sie im Ordner ``src/app`` für Ihr ``AppModule`` eine Routen-Konfiguration ``app.routes.ts``.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```typescript
    export const APP_ROUTES: Routes = [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: '**',
        redirectTo: 'home'
      }
    ];
    ```

  </p>
  </details>

5. Öffnen Sie die Datei ``app.module.ts`` und importieren Sie das ``RouterModule`` von Angular. Geben Sie dabei die Routen-Konfiguration aus der Datei ``app.routes.ts`` an.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```TypeScript
    @NgModule({
      imports: [
        BrowserModule,
        FormsModule,
        FlightBookingModule,
        HttpClientModule,

        RouterModule.forRoot(APP_ROUTES) // <-- Add this line!

      ],
      declarations: [
        AppComponent,
        SidebarComponent,
        NavbarComponent,
        HomeComponent
      ],
      providers: [
          […]
      ],
      bootstrap: [AppComponent]
    })
    export class AppModule { }

    ```

    </p>
    </details>

    Beachten Sie, dass hier die Methode ``forRoot`` zum Einsatz kommt, weil es sich beim AppModule um das RootModule (Hauptmodul) der Anwendung handelt.

6. Erzeugen Sie im Ordner ``src/app/flight-booking`` eine Datei ``flight-booking.routes.ts`` mit einer Routenkonfiguration für die ``FlightSearchComponent`` und die ``PassengerSearchComponent``.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```TypeScript
    export const FLIGHT_BOOKING_ROUTES: Routes = [
      {
        path: 'flight-search',
        component: FlightSearchComponent
      },
      {
        path: 'passenger-search',
        component: PassengerSearchComponent
      }
    ];
    ```

    </p>
    </details>

7. Öffnen Sie die Datei ``flight-booking.module.ts`` im Ordner ``src/app/flight-booking`` und importieren Sie das RouterModule. Geben Sie dabei die neue Routenkonfiguration an. Beachten Sie, dass hier die Methode **forChild** zum Einsatz kommt, weil es sich hierbei um ein Child-Module (Feature-Module) handelt.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```TypeScript
    @NgModule({
      imports: [
        CommonModule,
        FormsModule,
        SharedModule,

        RouterModule.forChild(FLIGHT_BOOKING_ROUTES) // <-- Add this line!

      ],
      declarations: [
        FlightSearchComponent,
        FlightCardComponent,
        PassengerSearchComponent,
        FlightEditComponent
      ],
      providers: [
        FlightService
      ],
      exports: [
        FlightSearchComponent
      ]
    })
    export class FlightBookingModule { }
    ```

    </p>
    </details>

8.	Öffnen Sie die Datei ``app.component.html`` und ersetzen Sie den Aufruf von ``flight-search`` durch einen Platzhalter (``<router-outlet></router-outlet>``) für den Router.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```HTML
    <div class="content">
        <!-- <flight-search></flight-search> --> <!-- alt --> 
        <router-outlet></router-outlet> <!-- neu -->
    </div>
    ```

    </p>
    </details>

9. Öffnen Sie die Datei ``sidebar.component.html`` und aktualisieren Sie die Menüeinträge um das Attribut routerLink, um die einzelnen Routen zu aktivieren.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```HTML
    <ul class="nav">
        <li>
            <a>
                <i class="ti-home"></i>
                <p><a routerLink="home">Home</a></p>
            </a>
        </li>

        <li>
            <a>
                <i class="ti-arrow-top-right"></i>
                <p><a routerLink="flight-search">Flights</a></p>
            </a>
        </li>

        <li>
            <a>
                <i class="ti-user"></i>
                <p><a routerLink="passenger-search">Passengers</a></p>
            </a>
        </li>
    </ul>
    ```

    </p>
    </details>

10.	Prüfen Sie mit dem TypeScript-Compiler in Ihrer IDE, ob es Kompilierungsfehler gibt und korrigieren Sie diese ggf.

11.	Testen Sie Ihre Lösung.

## Bonus: Routen im Hash-Fragment und Tracing *

Um die Arbeitsweise des Routers zu beeinflussen, nimmt die Methode ``forRoot`` über den zweiten optionalen Parameter ein Objekt entgegen. Damit lässt sich zum Beispiel angeben, dass Routen im Hash-Fragment der Url zu positionieren (z. B. http://localhost:4200/#/route anstatt http://localhost:4200/route) sind oder dass der Router Tracing-Meldungen auf der Konsole ausgeben soll:

```TypeScript
RouterModule.forRoot(APP_ROUTES, { useHash: true, enableTracing: true});
```

Aktivieren Sie diese Optionen und stellen Sie sicher, dass danach die Route im Hash-Fragment platziert wird, sowie dass der Router Informationen zum Routing auf der Konsole ausgibt.

##	Parametrisierbare Routen

In dieser Übung werden Sie im ``FlightBookingModule`` eine neue Komponent ``FlightEditComponent`` erstellen:

```
   AppComponent
      +----------- HomeComponent
      +----------- FlightSearchComponent ---- id ----+
      +----------- PassengerSearchComponent          |
      +----------- FlightEditComponent [NEU!] <------+
```

Diese soll eine Id als Url-Segment und einen Matrix-Parameter showDetails entgegennehmen und vorerst **lediglich** ausgeben. Diese Komponente soll über die einzelnen ``FlightCardComponents`` aufgerufen werden können.

1. Erstellen Sie im Ordner ``src/app/flight-booking/flight-edit`` eine ``FlightEditComponent`` (als Dummy-Komponente).

2. Öffnen Sie die Datei ``flight-booking.module.ts`` und stellen Sie sicher, dass die neue Komponente beim ``FlightBookingModule`` registriert ist.

3. Lassen Sie sich die ActivatedRoute in den Konstruktor der ``FlightEditComponent`` injizieren und rufen Sie die Matrix-Parameter ``id`` sowie ``showDetails`` ab.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```TypeScript
    @Component({
      selector: 'app-flight-edit',
      templateUrl: './flight-edit.component.html'
    })
    export class FlightEditComponent implements OnInit {
      id: string;
      showDetails: string;

      constructor(
        private route: ActivatedRoute) { }

      ngOnInit() {
        this.route.params.subscribe(
          params => {
            this.id = params['id'];
            this.showDetails = params['showDetails'];
          }
        );
      }
    }
    ```

    </p>
    </details>

4. Öffnen Sie die Datei ``flight-edit.component.html`` und geben Sie dort die abgerufenen Parameter aus.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```HTML
    <div class="card">
      <div class="header">
        <h1 class="title">Flight Edit</h1>
      </div>
      <div class="content">
        <p>Id: {{id}}</p>
        <p>ShowDetails: {{showDetails}}</p>
      </div>
    </div>
    ```
    
    </p>
    </details>

5. Öffnen Sie die Datei ``flight-booking.routes.ts`` und fügen Sie eine Route für die neue ``FlightEditComponent`` hinzu.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```TypeScript
    export const FLIGHT_BOOKING_ROUTES: Routes = [
      […],
      {
        path: 'flight-edit/:id',
        component: FlightEditComponent
      }
    ];
    ```

    Das Segment ``:id`` steht hier als Platzhalter für den Parameter id. Da es für den Parameter ``showDetails`` keinen Platzhalter gibt, ist dieser als Matrix-Parameter zu übergeben.
    
    </p>
    </details>

6. Öffnen Sie die Datei ``flight-card.component.html`` und fügen Sie einen Link für die neue Route ein.

    <details>
    <summary>Code anzeigen</summary>
    <p>
    
    ```HTML
    <a class="btn btn-default" 
      [routerLink]="['/flight-edit', item.id, { showDetails: true }]">   
      Edit
    </a>
    ```
    
    </p>
    </details>

7. Prüfen Sie mit dem TypeScript-Compiler in Ihrer IDE, ob es Kompilierungsfehler gibt und korrigieren Sie diese ggf.

8. Testen Sie Ihre Lösung: Suchen Sie nach Flügen und klicken Sie bei einem der gefundenen Flüge auf Edit.

##	Bonus: Flug Editieren *

In dieser Übung schaffen Sie die Möglichkeit, den in der ``FlightEditComponent`` präsentierten Flug zu editieren.

1. Öffnen Sie die Datei ``flight.service.ts`` und ergänzen Sie eine Methode ``findById``, welche einen Flug im Rahmen eines Observables anhand der Id liefert und eine Methode save, die einen Flug entgegennimmt und diesen speichert. 

    Zum Abrufen eines Fluges anhand der Id können Sie mit dem ``HttpClient`` einen GET-Aufruf mit dem Parameter id machen.

    Zum Speichern können Sie einen Flug mit der Methode ``post`` des ``HttpClients`` an den Server senden:

    ```TypeScript
    return this.http.post<Flight>(url, flight, { headers });
    ```

    Beachten Sie, dass die Datensätze mit den Ids 1 bis 5 nicht gespeichert werden können, da sie Präsentationen vorbehalen sind. 

    <details>
    <summary>Code anzeigen</summary>
    <p>
    
    ```TypeScript
    findById(id: string): Observable<Flight> {
        const url = 'http://www.angular.at/api/flight';
        const params = new HttpParams()
                          .set('id', id);
        const headers = new HttpHeaders()
                          .set('Accept', 'application/json');
        return this.http.get<Flight>(url, { params, headers});
    }

    save(f: Flight): Observable<Flight> {
        const url = 'http://www.angular.at/api/flight';
        const headers = new HttpHeaders()
                          .set('Accept', 'application/json');
        return this.http.post<Flight>(url, f, { headers});
    }
    ```
  
  </p>
  </details>


2. Öffnen Sie die ``flight-edit.component.ts`` und fügen Sie eine Eigenschaft flight vom Type Flight und eine Eigenschaft errors vom Typ string ein. Diese Eigenschaft soll eventuelle Fehler, die sich beim Speichern ergeben, aufnehmen. Lassen Sie sich außerdem den FlightService injizieren.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```TypeScript
    @Component({
      selector: 'app-flight-edit',
      templateUrl: './flight-edit.component.html'
    })
    export class FlightEditComponent implements OnInit {
      id: string;
      showDetails: string;

      flight: Flight;
      errors: string;

      constructor(
        private route: ActivatedRoute,
        private flightService: FlightService) { }

      […]
    }
    ```

    </p>
    </details>


3. Laden Sie in der ``FlightEditComponent`` nach dem Abrufen des Parameters ``id`` den jeweiligen Flug und bieten Sie eine ``save``-Methode zum Speichern an. 

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```TypeScript
    @Component({
      selector: 'app-flight-edit',
      templateUrl: './flight-edit.component.html'
    })
    export class FlightEditComponent implements OnInit {
      
      […]

      ngOnInit() {
        this.route.params.subscribe(
          params => {
            this.id = params['id'];
            this.showDetails = params['showDetails'];

            this.flightService.findById(this.id).subscribe(
              flight => { this.flight = flight; this.errors = ''; },
              err => { this.errors = 'Fehler beim Laden'; }
            );
          }
        )
      }

      save() {
        this.flightService.save(this.flight).subscribe(
          flight => { 
              this.flight = flight; 
              this.errors = 'Saving was successful!'; 
          },
          err => { this.errors = 'Error saving data'; }
        );
      }

    }
    ```

    </p>
    </details>


4. Öffnen Sie die Datei ``flight-edit.component.html`` und stellen Sie ein Formular zum Editieren des geladenen Fluges bereit:
    ```HTML
    <form *ngIf="flight">

    <div class="form-group">
        <label>Id:</label>
        <input [(ngModel)]="flight.id" name="id" class="form-control">
    </div>

    <div class="form-group">
        <label>From:</label>
        <input [(ngModel)]="flight.from" name="from" 
              class="form-control">
    </div>

    <!-- Fügen Sie hier Felder für die weiteren Eigenschaften -->
    <!-- des Fluges hinzu -->

    <button class="btn btn-default" (click)="save()">Save</button>

    </form>
    ```
5. Öffnen Sie die Datei ``flight-booking.module.ts`` und stellen Sie sicher, dass der ``FlightService`` hier registriert wird.

    <details>
    <summary>Code anzeigen</summary>
    <p>
    
    ```TypeScript
    @NgModule({
      imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        RouterModule.forChild(FLIGHT_BOOKING_ROUTES)
      ],
      declarations: [
        FlightSearchComponent,
        FlightCardComponent,
        PassengerSearchComponent,
        FlightEditComponent
      ],
      providers: [
        FlightService  // <-- Diese Zeile ist wichtig
      ],
      exports: [
        FlightSearchComponent
      ]
    })
    export class FlightBookingModule { }
    ```
    
    </p>
    </details>

    Hierdurch wird der ``FlightService`` als globaler Service registriert. Da er nun von mehreren Komponenten verwendet ist, ist das zweckmäßig. Alternativ dazu könnte er auch für die FlightBookingComponent registriert werden.

6. Prüfen Sie mit dem TypeScript-Compiler in Ihrer IDE, ob es Kompilierungsfehler gibt und korrigieren Sie diese ggf.

7. Testen Sie Ihre Lösung. Beachten Sie, dass Sie die Datensätze 1 bis 5 nicht verändern können und dass Sie einen neuen Datensatz erzeugen können, indem Sie die Id 0 angeben.

## Bonus: Programmatisches Routing *

Betrachten Sie die Dokumentation der Methode navigate des Routers unter [1]. Lassen Sie sich in die ``FlightEditComponent`` den Router injizieren und nutzen Sie dessen ``navigate``-Methode nach dem erfolgreichen Speichern, um den Benutzer zurück zur Suchmaske zu leiten. 

Erweiterung: Stellen Sie nach dem Umleiten zur Suchmaske eine Erfolgsmeldung für den letzten Speicherungsvorgang dar.

[1] https://angular.io/docs/ts/latest/api/router/index/Router-class.html#!#navigate-anchor

