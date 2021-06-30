# Angular Workshop: Building-Blocks

- [Angular Workshop: Building-Blocks](#angular-workshop-building-blocks)
  - [Ihre erste Angular-Komponente](#ihre-erste-angular-komponente)
    - [Komponente zum Suchen nach Flügen](#komponente-zum-suchen-nach-flügen)
    - [Den Debugger verwenden](#den-debugger-verwenden)
    - [Bonus: Flüge editieren *](#bonus-flüge-editieren-)
  - [Bonus: Passagiere suchen und editieren \*\*](#bonus-passagiere-suchen-und-editieren-)
  - [Eigenen Services erstellen](#eigenen-services-erstellen)
    - [FlightService](#flightservice)
    - [Bonus: Alternative Implementierung *](#bonus-alternative-implementierung-)
    - [Bonus: useFactory **](#bonus-usefactory-)
  - [Eigene Pipe erstellen](#eigene-pipe-erstellen)
  - [Bonusaufgaben zu Pipes](#bonusaufgaben-zu-pipes)
    - [Bonus: StatusColorPipe *](#bonus-statuscolorpipe-)
    - [Bonus: StatusFilterPipe \*](#bonus-statusfilterpipe-)
    - [Bonus: Service für Pipe \*](#bonus-service-für-pipe-)
    - [Bonus: Asynchroner Service für Pipe **](#bonus-asynchroner-service-für-pipe-)
  - [Module](#module)
  - [Komponenten](#komponenten)
    - [FlightCardComponent](#flightcardcomponent)
    - [Bonus: FlightStatusToggleComponent \*\*](#bonus-flightstatustogglecomponent-)
    - [Bonus: Content Projection **](#bonus-content-projection-)

## Ihre erste Angular-Komponente

### Komponente zum Suchen nach Flügen

In diesem Teil der Übung werden Sie die präsentierte _FlightSearchComponent_ implementieren. Sie können dazu den nachfolgenden Anweisungen schrittweise folgen oder lediglich bei Bedarf nachschlagen.

1. Erzeugen Sie im Ordner _src/app_ einen Ordner _entities_.

1. Erzeugen Sie im neuen Ordner _entities_ eine Datei _flight.ts_:

      ```TypeScript
      export interface Flight {
        id: number; 
        from: string;
        to: string;
        date: string;
        delayed: boolean;
      }
      ```
2. Erzeugen Sie im Ordner _src/app_ eine _FlightSearchComponent_

    **Wichtig:** Es existieren mehrere Möglichkeiten zum Genieren von Komponenten:

      - **Visual Studio Code:** Wenn Sie die oben erwähnten Plugins installiert haben, finden Sie im Kontextmenü Ihrer Ordner einen Befehl ``Angular: Generate a Component``.  
      - **WebStorm/IntelliJ**: Hier finden Sie im Kontextmenü Ihrer Ordner einen Befehl ``Angular Schematics``.
      - **Kommandozeile**: Mit der CLI können Sie auf der Kommandozeile Komponenten erzeugen. Wechseln Sie dazu ins Root Ihres Projektes und geben Sie den folgenden Befehl ein:
      
          ```
          ng generate component flight-search
          ```

          Die Kurzform hierfür lautet:

          ```
          ng g c flight-search
          ```

          Mit dem Schalter --help erhält man Informationen zu allen Optionen:

          ```
          ng g --help
          ng g c --help
          ```

3. Öffnen Sie die Datei _flight-search.component.ts_ und vergeben Sie den Selektor _flight-search_:

    ```TypeScript
    @Component({
      selector: 'flight-search',
      templateUrl: './flight-search.component.html'
    })
    export class FlightSearchComponent implements OnInit {
      […]
    }
    ```
4. Spendieren Sie der Klasse _FlightSearchComponent_ die folgenden Member:

    ```TypeScript
    @Component({
      selector: 'flight-search',
      templateUrl: './flight-search.component.html'
    })
    export class FlightSearchComponent implements OnInit {

      from: string;
      to: string;
      flights: Array<Flight> = [];
      selectedFlight: Flight;

      constructor(private http: HttpClient) {
      }

      ngOnInit() { }

      search(): void {
        // Implementierung wird gleich ergänzt
      }

      select(f: Flight): void {
        this.selectedFlight = f;
      }
    }
    ```

5. Implementieren Sie die Methode _search_, sodass sie anhand der Parameter _from_ und _to_ mit dem injizierten ``HttpClient`` nach Flügen sucht und das Ergebnis in ``flights`` ablegt.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```TypeScript
    search(): void {

      let url = 'http://www.angular.at/api/flight';

      let headers = new HttpHeaders()
          .set('Accept', 'application/json');

      let params = new HttpParams()
          .set('from', this.from)
          .set('to', this.to);

      this.http
      .get<Flight[]>(url, {headers, params})
      .subscribe({
        next: (flights: Flight[]) => {
          this.flights = flights;
        },
        error: (errResp) => {
          console.error('Error loading flights', errResp);
        }
      });
    }
    ```
 </p>
 </details>

6. Wechseln Sie in die Datei ``flight-search.component.html``, welche das dazugehörige Template repräsentiert und fügen Sie einen Abschnitt mit einem Suchformular ein. Sie können dazu das folgende HTML, das Sie jedoch **noch um Datenbindungsausdrücke** erweitern müssen, verwenden:

    ```HTML
    <div class="card">

      <div class="header">
        <h2 class="title">Flight Search</h2>
      </div>

      <div class="content">

      <form>
        <div class="form-group">
          <label>From:</label>
          <input name="from" class="form-control">
        </div>
        <div class="form-group">
          <label>To:</label>
          <input name="to" class="form-control">
        </div>
    
        <div class="form-group">
          <button
            class="btn btn-default">Search</button>
        </div>
      </form>

      </div>
    </div>
    ```
   
7. Stellen Sie auch sicher, dass die Schaltfläche nur zur Verfügung steht, wenn ``from`` und ``to`` einen Wert aufweisen.

    <details>
    <summary>Code inkl. Datenbindungsausdrücken anzeigen</summary>
    <p>

    ```HTML
    <div class="card">

      <div class="header">
      <h2 class="title">Flight Search</h2>
      </div>

      <div class="content">

      <form>
        <div class="form-group">
        <label>From:</label>
        <input [(ngModel)]="from" name="from" class="form-control">
        </div>
        <div class="form-group">
        <label>To:</label>
        <input [(ngModel)]="to" name="to" class="form-control">
        </div>

        <div class="form-group">
        <button
        [disabled]="!to || !from"
        (click)="search()"
        class="btn btn-default">Search</button>
        </div>
      </form>

      </div>
    </div>
    ```

    </p>
    </details>



1. Ergänzen Sie am Ende des Templates einen weiteren Abschnitt, der die gefundenen Flüge in einer Tabelle auflistet. Sie können dazu das folgende HTML-Fragment, das Sie **jedoch noch um Datenbindungsausdrücke erweitern müssen** verwenden:

    ```HTML
    <div class="card">

      <table class="table table-contensed">
      <thead>
      <tr>
        <th>Id</th>
        <th>From</th>
        <th>To</th>
        <th>Date</th>
        <th></th>
      </tr>
      </thead>
      <tr>
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>
        <a>Select</a> 
        </td>
      </tr>
      </table>

    </div>
    ```

    Die ausgewählte Zeile soll mit der Klasse ``active`` hervorgehoben werden. Wurden keine Flüge gefunden, soll die Tabelle nicht angezeigt werden.

    <details>
    <summary>Code inkl. Datenbindungsausdrücke anzeigen</summary>
    <p>

    ```HTML
    <div class="card">

      <table class="table table-contensed" *ngIf="flights.length > 0">
      <thead>
      <tr>
        <th>Id</th>
        <th>From</th>
        <th>To</th>
        <th>Date</th>
        <th></th>
      </tr>
      </thead>
      <tr *ngFor="let f of flights" 
        [class.active]="f === selectedFlight">
        <td>{{f.id}}</td>
        <td>{{f.from }}</td>
        <td>{{f.to }}</td>
        <td>{{f.date | date:'dd.MM.yyyy HH:mm'}}</td>
        <td>
        <a (click)="select(f)">Select</a> 
        </td>
      </tr>
      </table>

    </div>
    ```

    </p>
    </details>

2. Fügen Sie einen dritten Abschnitt zum Template hinzu. Dieser soll den selektierten Flug präsentieren:

    ```HTML
    <div class="card">
      <div class="content">
      <!-- {{title}} --> <!-- Alte Zeile  -->
      <pre>{{ selectedFlight | json }}</pre> <!-- neue Zeile --> 
      </div>
    </div>
    ```

3. Öffnen Sie die Datei _app.module.ts_ und vergewissern Sie sich, dass die neue _FlightSearchComponent_ unter _declarations_ registriert wird.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```TypeScript
    @NgModule({
      imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule
      ],
      declarations: [
        AppComponent,
        FlightSearchComponent,
        […] // keep the rest here
      ],
      providers: [],
      bootstrap: [AppComponent]
    })
    export class AppModule { }
    ```

    </p>
    </details>


4.  Wechseln Sie in die Datei _app.component.html_, um dort die neue Komponente aufzurufen:

    ```HTML
    […]
    <div class="content">
      <flight-search></flight-search>
    </div>
    […]
    ```

5.  Prüfen Sie, ob Kompilierungsfehler auf der Konsole angezeigt werden.

6.  Starten Sie die Lösung wie weiter oben im Rahmen der Einführung gezeigt (``npm start``) und testen Sie sie im Browser, indem Sie nach Flügen von ``Graz`` nach ``Hamburg`` suchen. Eine Liste mit weiteren möglichen Städten finden Sie [hier](http://angular.at/api/airport).

### Den Debugger verwenden

1. Öffnen Sie in Chrome die Developer-Tools (F12).

2. Wechseln Sie in das Registerblatt Source und schließen Sie dort alle Dateien.

1. Drücken Sie STRG+P und tippen Sie den Namen _flight-search.component_ ein.

2. Erstellen Sie am Beginn Ihrer _search_-Methode einen Breakpoint.

1. Suchen Sie nach Flügen und stellen Sie fest, dass der Browser die Ausführung beim Breakpoint anhält.

2. Betrachten Sie die Informationen, die der Debugger zu den einzelnen Variablen liefert. Diese werden beim Mouse-Over angezeigt und gehen Sie Schritt für Schritt durch Ihre Methode durch.

### Bonus: Flüge editieren *

Schaffen Sie die Möglichkeit, den ausgewählten Flug zu editieren. Dazu soll nach dem Auswählen unter der Tabelle ein Formular präsentiert werden.

Gehen Sie dazu wie folgt vor:

1. Führen Sie in Ihrer Komponente eine Eigenschaft _message_ ein, über die Sie später den Benutzer über den Erfolg oder Misserfolg der Speichern-Operation informieren.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```TypeScript
    @Component({
      selector: 'flight-search',
      templateUrl: './flight-search.component.html'
    })
    export class FlightSearchComponent {

      message: string;

      [...]
    }
    ```

    </p>
    </details>


1. Erweitern Sie Ihre **bestehende** Komponente um eine Methode zum Speichern des ausgewählten Fluges. Diese soll mit dem ``HttpClient`` die Eigenschaft _selectedFlight_ per POST zum Server senden. Dazu weist der HttpClient eine Methode ``post`` auf:
 
    ```TypeScript
      this.http
      .post<Flight>(url, this.selectedFlight, { headers })
      .subscribe( ... );
    ```

    <details>
    <summary>Code anzeigen</summary>
    <p>
    
    ```TypeScript
    save(): void {

      const url = 'http://www.angular.at/api/flight';

      const headers = new HttpHeaders()
              .set('Accept', 'application/json');

      this.http
      .post<Flight>(url, this.selectedFlight, { headers })
      .subscribe({
        next: flight => {
          this.selectedFlight = flight;
          this.message = 'Success!';
        },
        error: errResponse => {
          console.error('Error', errResponse);
          this.message = 'Error: ';
        }
      });
    }
    ```
    
    </p>
    </details>

1. Schaffen Sie im Template die Möglichkeit, den _selectedFlight_ zu editieren. Um Null-Zugriffe zu vermeiden, sollten Sie mit _\*ngIf_ prüfen, ob es einen selektierten Flug gibt. Sie können dazu das folgende HTML-Fragment, das Sie noch um Datenbindungsausdrücke erweitern müssen, verwenden:

    ```HTML
    <div *ngIf="selectedFlight">

      <div>
      {{ message }}
      </div>

      <div class="form-group">
      <label>Id</label>
      <input class="form-control">
      </div>

      <div class="form-group">
      <label>From</label>
      <input class="form-control">
      </div>

      <!-- Ergänzen Sie hier analog Felder für die weiteren Eigenschaften des Fluges -->

      […]
    
      <button class="btn btn-default">Save</button>

    </div>
    ```

    <details>
    <summary>Code inkl. Datenbindungsausdrücke anzeigen</summary>
    <p>
    
    ```HTML
    <div *ngIf="selectedFlight">

      <div>
      {{ message }}
      </div>

      <div class="form-group">
      <label>Id</label>
      <input [(ngModel)]="selectedFlight.id" class="form-control">
      </div>

      <div class="form-group">
      <label>From</label>
      <input [(ngModel)]="selectedFlight.from" class="form-control">
      </div>

      <!-- Ergänzen Sie hier analog Felder für die weiteren Eigenschaften des Fluges -->

      […]
    
      <button (click)="save()" class="btn btn-default">Save</button>

    </div>
    ```
    
    </p>
    </details>



1. Führen Sie die Anwendung aus und testen Sie sie. Beachten Sie, dass Sie die Datensätze mit den Ids 1 bis 5 nicht editieren können, damit diese Datensätze in jeder Demo zur Verfügung stehen. Um einen neuen Flug zu erzeugen, können Sie die Id 0 vergeben. Nach dem Speichern am Server wird diese durch die nächste freie Id ersetzt.

## Bonus: Passagiere suchen und editieren \*\*

Sie finden unter [http://www.angular.at/api/passenger](http://www.angular.at/api/passenger) eine weitere Web API, die als Ergänzung zu Flügen Passagiere anbietet. Infos über die unterstützen Verben und Datenstrukturen finden Sie unter [http://www.angular.at/help](http://www.angular.at/help). Beachten Sie bitte folgende Aspekte:

- Als Suchparameter für Passagiere bietet sich ``name`` (= Familienname) und ``firstName`` an. Ersterer ist Pflicht, zweiterer ist optional: [http://www.angular.at/api/passenger?name=Muster](http://www.angular.at/api/passenger?name=Muster)
- Mit POST können Sie Passagiere einfügen, wenn Sie die Id 0 vergeben.
- Mit POST können Sie auch einen Passagier editieren, wenn Sie dessen Id angeben.
- Die Passagiere mit den Ids 1 bis 5 können nicht gespeichert werden (sie sind Demos und Präsentationen vorbehalten).
- Während für XML Pascal-Case (z. B. _PassagierStatus_) zum Einsatz kommt, verwendet die JSON-repräsentation das unter JavaScript übliche Camel-Case (z. B. _passagierStatus_). Damit wird den Gepflogenheiten der beiden Standards Rechnung getragen.

Sie können nun Ihre Anwendung auch erweitern, sodass man Passagiere suchen und editieren kann.

Falls Sie diese Erweiterung implementieren, können Sie sie in allen weiteren Übungen auch analog zur beschriebenen Funktionalität rund um Flüge erweitern.

**Tipp:** Rufen Sie Ihre Passagier-Komponente vorerst einfach in der Datei ``app.component.html`` unterhalb von ``flight-search`` auf. Suchen Sie zum Testen nach Max Muster (firstname: Max, name: Muster).

## Eigenen Services erstellen

### FlightService

In dieser Übung werden Sie einen ``FlugService``, der die Kommunikation mit der Flug API via HTTP übernimmt, entwickeln und innerhalb Ihrer Komponente verwenden:

```
[FlightSearchComponent] --> [FlightService]
```

Sie können dazu den nachfolgenden Punkten folgen oder nur bei Bedarf nachschlagen.

1. Erstellen Sie im Ordner _flight-search_ einen Service. Die Datei dieses Services soll _flight.service.ts_ heißen.

1. Implementieren Sie in dieser Datei einen _FlightService_, der die von der Anwendung benötigten Flüge abruft. Dieser muss sich zum Verrichten seiner Aufgabe den _HttpClient_ injizieren lassen.

    <details>
    <summary>Code anzeigen</summary>
    <p>
    
    ```TypeScript
    @Injectable({ providedIn: 'root' })
    export class FlightService {

    constructor(private http: HttpClient) {
    }

      find(from: string, to: string): Observable<Flight[]> {
      let url = 'http://www.angular.at/api/flight';

      let headers = new HttpHeaders()
            .set('Accept', 'application/json');

      let params = new HttpParams()
            .set('from', from)
            .set('to', to);

      return this.http.get<Flight[]>(url, {headers, params});
      }

    }
    ```
    
    </p>
    </details>

    Falls Sie die Bonus-Aufgabe _Flüge editieren_ weiter oben gemacht haben, müssen Sie nun auch die Methode _save_ in den Service auslagern.
    
    <details>
    <summary>Code anzeigen</summary>
    <p>
    
    ```TypeScript
    save(flight: Flight): Observable<Flight> {
      let url = 'http://www.angular.at/api/flight';

      let headers = new HttpHeaders()
          .set('Accept', 'application/json');

      return this.http.post<Flight>(url, flight, { headers });
    }
    ```
    
    </p>
    </details> 


2. Öffnen Sie die Datei _flight-search.component.ts_ und lassen Sie sich den neuen Service in den Konstruktor injizieren.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```TypeScript
    […]
    export class FlightSearchComponent {
      […]
      constructor(private flightService: FlightService) { }
      […]
    }
    ```

    </p>
    </details>

1. Nutzen Sie den injizierten _FlightService_ in der Methode _search_ zum Suchen nach Flügen.

    <details>
    <summary>Code anzeigen</summary>
    <p>
    
    ```TypeScript
    search(): void {
      this.flightService
      .find(this.from, this.to)
      .subscribe({
        next: (flights) => {
          this.flights = flights;
        },
        error:  (errResp) => {
          console.error('Error loading flights', errResp);
        }
      });
    }
    ```
    
    </p>
    </details>



2. Testen Sie Ihre Lösung im Browser.

1. Stellen Sie mit dem Debugger sicher, dass zunächst der _FlightService_ den _HttpClient_ injiziert bekommt und dann die Komponente den _FlightService_ auf diese selbe Weise erhält.



<!-- 
### Bonus: Augury *

1. Installieren Sie das Chrome-Plugin Augury (``augury.angular.io``).

1. Registrieren Sie Ihren Service global (im _AppModule_) und nutzen Sie ihn in Ihrer Komponente.

2. Laden Sie Ihre Anwendung und wechseln Sie in den Dev-Tools (F12) auf das neue Registerblatt Augury.

1. Markieren Sie die _FlightSearchComponent_ und wechseln Sie in das Registerblatt _Injector Graph_.

1. Dort sollten Sie nun in einer graphischen Übersicht sehen, wo Ihr Service registriert wird und dass er in die _FlightSearchComponent_ injiziert wird.

-->

### Bonus: Alternative Implementierung *

1. Erzeugen Sie im Ordner _flight-search_ eine neue Datei mit einem ``AbstractFlightService``:

    ```TypeScript
    export abstract class AbstractFlightService {
      abstract find(from: string, to:string): Observable<Flight[]>;
    }
    ```

1. Wechseln Sie in die Datei _flight.service.ts_ und lassen Sie _FlightService_ die Klasse _AbstractFlightService_ implementieren:

    ```TypeScript
    @Injectable({ [...] })
    export class FlightService implements AbstractFlightService {
      […]
    }
    ```

    Das Schlüsselwort _implements_ gibt an, dass der _FlightService_ sämtliche Methoden des _AbstractFlightServices_ implementieren muss. Im Gegensatz zum Schlüsselwort _extends_ findet jedoch keine Vererbung statt.

2. Wechseln Sie in die Datei app.module.ts und erzeugen Sie einen Provider für den AbstractFlightService:

    ```typescript
    @NgModule({
      [...],
      providers: [
          { 
            provide: AbstractFlightService, 
            useClass: FlightService
          }
      ],
      [...]
    })
    export class AppModule { }
    ```

3. Fordern Sie per Dependency Injection in Ihrer Komponente eine Instanz von _AbstractFlightService_ **anstatt* einer Instanz von _FlightService_ an:

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```TypeScript
    constructor(private flightServie: AbstractFlightService) { […] }
    ```

    </p>
    </details>

    <br>


4. Testen Sie Ihre Lösung.

5. Erstellen Sie im Ordner _flight-search_ eine Datei _dummy-flight.service.ts_.

6. Stellen Sie in dieser Datei eine alternative Implementierung von _AbstractFlightService_ zur Verfügung. Diese soll sich _DummyFlightService_ nennen und ein paar hartcodierte Flüge zum Testen zurück liefern:

    ```TypeScript
    import { of } from 'rxjs';
    […]

    @Injectable()
    export class DummyFlightService implements AbstractFlightService {

      find(from: string, to: string): Observable<Flight[]> {

      return of([{id: 17, from: 'Graz', to: 'Hamburg', date: '2022-01-01', delayed: true}]);

      }
    }
    ```

    Die hier gezeigte Funktion _of_ erzeugt ein Observable, das das übergebene Array mit Flügen zurückliefert.  

7. Lassen Sie nun Ihren ``AbstractFlightService`` auf den neuen ``DummyFlightService`` verweisen.

    <details>
    <summary>Code anzeigen</summary>
    <p>
    
    ```typescript
    @NgModule({
      [...],
      providers: [
          { 
            provide: AbstractFlightService, 
            useClass: DummyFlightService
          }
      ],
      [...]
    })
    export class AppModule { }
    ```
    
    </p>
    </details>

    <br>

8. Testen Sie Ihre Lösung und vergewissern sie sich, dass der neue _DummyFlightService_ zum Einsatz kommt.

9.  Stellen Sie die Serviceregistrierung wieder um, sodass Sie allen Konsumenten, die den _AbstractFlightService_ verlangen, den ursprünglichen _FlightService_ zukommen lässt:

    ```typescript
    @NgModule({
      [...],
      providers: [
          { 
            provide: AbstractFlightService, 
            useClass: FlightService
          }
      ],
      [...]
    })
    export class AppModule { }
    ```

### Bonus: useFactory **

Mit ``useFactory`` können Sie eine Factory-Funktion, die angibt, wie Ihr Service zu erzeugen ist, angeben:

  ```typescript
  @NgModule({
    [...],
    providers: [
        { 
          provide: AbstractFlightService, 
          useFactory: (http: HttpClient) => new FlightService(http),
          deps: [HttpClient]
        }
    ],
    [...]
  })
  export class AppModule { }
  ```

Erstellen Sie in dieser Datei eine Konstante ``DEBUG``, welche entweder ``true`` oder ``false`` sein kann. Ändern Sie die Factory ab, sodass sie in Abhängigkeit von ``DEBUG`` den ``FlightService`` (``DEBUG===false``) oder den ``DummyFlightService`` (``DEBUG===true``) zurückliefert.

## Eigene Pipe erstellen

1. Erstellen Sie im Ordner _src/app_ die Unterordner _shared/pipes_.

2. Erstellen Sie in diesem Ordner eine neue Datei _city.pipe.ts_ mit einer _CityPipe_. Diese Pipe soll die Städtenamen wie ``Graz`` oder ``Hamburg`` abhängig von einem übergebenen Parameter entweder auf Flughafencodes wie ``GRZ`` oder ``HAM`` oder auf Lanbezeichnungen wie ``Flughafen Graz Thalerhof`` oder ``Airport Hamburg Helmut Schmidt`` abbilden.

    <details>
    <summary>Code anzeigen</summary>
    <p>
    
    ```TypeScript
    import { Pipe, PipeTransform } from '@angular/core';

    @Pipe({
      name: 'city',
      pure: true
    })
    export class CityPipe implements PipeTransform {

      transform(value: string, fmt: string): string {

        let short, long;

        switch(value) {
          case 'Graz':
            short = 'GRZ';
            long = 'Flughafen Graz Thalerhof';
            break;
          case 'Hamburg':
            short = 'HAM';
            long = 'Airport Hamburg Fulsbüttel Helmut Schmidt';
          break;
          case 'Wien':
            short = 'VIE';
            long = 'Flughafen Wien Schwechat';
          break;
          default:
            short = long = value    ;
        }

        if (fmt == 'short') return short;
        return long;

      }

    }
    ```
    
    </p>
    </details>

3. Öffnen Sie die Datei _app.module.ts_ und stellen Sie sicher, dass die neue Pipe registriert wurde.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```TypeScript
    @NgModule({
    imports: [
      BrowserModule,
      FormsModule,
      HttpClientModule
    ],
    declarations: [
      [...],
      AppComponent,
      FlightSearchComponent,
      CityPipe   // <-- Diese Zeile ist wichtig!
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

    <br>


1. Öffnen Sie die Datei _flight-search.component.html_ und nutzen Sie die _CityPipe_ zum Formatieren der Städte der gefundenen Flüge.

    <details>
    <summary>Code anzeigen</summary>
    <p>
    
    ```TypeScript
    <div class="card">

      <table class="table table-contensed" *ngIf="flights.length > 0">
      <thead>
      <tr>
      <th>Id</th>
      <th>From</th>
      <th>To</th>
      <th>Date</th>
      <th></th>
      </tr>
      </thead>
      <tr *ngFor="let f of flights" 
        [class.active]="f === selectedFlight">
      <td>{{f.id}}</td>
      <td>{{f.from | city:'short' }}</td>
      <td>{{f.to | city:'long' }}</td>
      <td>{{f.date | date:'dd.MM.yyyy HH:mm'}}</td>
      <td>
        <a (click)="select(f)">Select</a> 
      </td>
      </tr>
      </table>

    </div>
    ```
    
    </p>
    </details>

1. Testen Sie Ihre Lösung.


## Bonusaufgaben zu Pipes

### Bonus: StatusColorPipe *

Erstellen Sie eine _StatusColorPipe_, welche die Eigenschaft _delayed_ des Fluges (true oder false) auf eine Farbe abbildet. Nutzen Sie diese Pipe gemeinsam mit der Direktive _ngStyle_, um diese Farbe zur CSS-Eigenschaft _color_ des ausgegebenen Status zuzuweisen:

```HTML
<td [ngStyle]="{color: f.delayed | statusColor }">
 {{ f.date | date:'dd.MM.yyyy HH:mm'}}
</td>
```

### Bonus: StatusFilterPipe \*

Erstellen Sie eine _StatusFilterPipe_, welche ein Array mit Flügen filtert, sodass nur Flüge mit einem bestimmten Wert für _delayed_ zurückgeliefert werden. Die Pipe soll wie folgt verwendet werden können:

```HTML
<tr *ngFor="let f of flights | statusFilter:true">
</tr>
```

Der Parameter _true_ gibt hier an, dass nur die Flüge mit _delayed=true_ zurückzuliefern sind.

Die Transform-Methode dieser Pipe nimmt das gesamte Array entgegen und liefert danach eine gefilterte Version zurück:

```TypeScript
transform(flights: Array<Flight>, delayed: boolean): Array<Flight> {
 […]
}
```

Eine Beschreibung der Methoden, welche die Klasse Array anbietet, finden Sie unter anderem hier:
[https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global\_Objects/Array](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array)

### Bonus: Service für Pipe \*

Lagern Sie die Logik mit dem Switch-Block in einen neuen ``AirportService`` aus. Lassen Sie den ``AirportService`` ihn in den Konstruktor der Pipe injizieren (funktioniert wie bei Komponenten). Rufen Sie dann den Service in der Methode ``transform`` auf und testen Sie Ihre Lösung.

### Bonus: Asynchroner Service für Pipe **

Sie finden unter den nachfolgenden Urls zwei Services, die den offiziellen Kurz- sowie den offiziellen Lang-Namen eines Flughafens (als String) liefern:

- [http://angular-at.azurewebsites.net/api/airport/code?name=Graz](http://angular-at.azurewebsites.net/api/airport/code?name=Graz)
- [http://angular-at.azurewebsites.net/api/airport/fullName?name=Graz](http://angular-at.azurewebsites.net/api/airport/fullName?name=Graz)

Erweitern Sie Ihren Airport-Service um Methoden, die damit die Lang- bzw. Kurz-Bezeichnung eines Flughafens als ``Observable<String>``
zurückliefern.

Schreiben Sie eine neue ``AsyncCityPipe``, die sich diesen Service injizieren lässt. Die ``transform``-Methode soll an den Service delegieren und das gewünschte Ergebnis in Form des erhaltenen als _Observable&lt;string&gt;_ zurückliefern. Damit Angular dieses Observable auflösen kann, muss im Template zusätzlich die Async-Pipe verwendet werden:

```HTML 
[...]
{{ f.from | asyncCity:'short' | async }}
[...]
``` 

**Wichtig:** Die Pipe muss ``pure`` sein, um Probleme mit der Datenbindung zu vermeiden. Pipes, die nicht pure sind, werden ja nach jedem Event neu ausgeführt. Dadurch, dass die Pipe selbst ein durch die Server-Anfrage ein Daten-Event triggert, käme es hier zu einer Endlosschleife.


## Module

In dieser Übung werden Sie Ihre Lösung refaktorieren, sodass sich die folgende Module-Struktur ergibt:

```
[AppModule] --> [FlightBookingModule] --> [SharedModule]
```

Jedes Modul erhält Ihren eigenen Ordner und im Rahmen dessen wird die ``FlightSearchComponent`` in den neu geschaffenen Ordner des ``FlightBookingModule``s verschoben:

```
 /src
 +-- /app
  +-- ...
  +-- /flight-booking
   +-- ...
   +-- /flight-search
    +-- flight-search.component.ts
    +-- flight-search.component.html
    +-- ..
   +-- flight-booking.module.ts
  +-- /shared
   +-- ...
   +-- shared.module.ts
  +-- app.module.ts
```

Denken Sie daran, dass das ``SharedModule`` und das ``FlightBookingModule`` das von Angular angeobtene ``CommonModule`` (``@angular/common``) importieren muss, damit Standard-Direktiven und -Pipes wie ``ngFor`` oder ``date`` gefunden werden.

<details>
<summary>Einzelne Schritte anzeigen</summary>
<p>


1. Erstellen Sie im Ordner _shared_ eine Datei _shared.module.ts_ und spendieren Sie dieser Datei eine Klasse _SharedModule_:

    ```TypeScript
    @NgModule({
      imports: [
        CommonModule
      ],
      declarations: [
        CityPipe
      ],
      exports: [
        CityPipe
      ]
    })
    export class SharedModule { }
    ```

    Beachten Sie, dass nun hier die _CityPipe_ sowohl deklariert als auch exportiert wird.

1. Erstellen Sie im Ordner _src/app_ einen Ordner _flight-booking_.

1. Verschieben Sie den Ordner _flight-search_ nach _flight-booking_. Passen Sie alle vorhandenen relativen Pfade an, falls dieser Refaktorierungsschritt nicht ohnehin von Ihrer IDE übernommen wird.

1. Erstellen Sie im Ordner _flight-booking_ eine Datei _flight-booking.module.ts_ mit einem _FlightBookingModule_:

    ```TypeScript
    @NgModule({
    imports: [
      CommonModule,
      FormsModule,
      SharedModule
    ],
    declarations: [
      FlightSearchComponent
    ],
    providers:[
    ],
    exports: [
      FlightSearchComponent
    ]
    })
    export class FlightBookingModule { }
    ```

    Beachten Sie, dass hier das _SharedModule_ importiert wird. Die von ihr angebotene _CityPipe_ kommt in der _FlightSearchComponent_ zum Einsatz.

1. Wechseln Sie in die Datei _app.module.ts_ und passen Sie Ihr _AppModule_ wie folgt an:

    ```TypeScript
    @NgModule({
    imports: [
      BrowserModule,
      HttpClientModule,
      FlightBookingModule // <-- Wichtig
    ],
    declarations: [
      AppComponent,
      SidebarComponent,
      NavbarComponent
    ],
    providers: [
      […]
    ],
    bootstrap: [AppComponent]
    })
    export class AppModule { }
    ```

1. Kompilieren Sie Ihre Lösung mit dem TypeScriptCompiler in Ihrer IDE und korrigieren Sie eventuelle Fehler (z. B. fehlerhafte relative Pfade, die sich durch das Verschieben ergeben haben).

2. Testen Sie Ihre neu strukturierte Lösung.
</p>
</details>

## Komponenten

In dieser Übung werden Sie zunächst die gezeigte FlightCardComponent erstellen. Danach werden Sie in einer Bonus-Übung eine eigene Komponente mit dem dabei aufgebauten Wissen erzeugen.

### FlightCardComponent

1. Erstellen im Ordner ``flight-booking`` eine neue Komponente ``flight-card``, die aus einem Unterordner ``flight-card`` mit folgenden Dateien besteht:

    - flight-card.component.html
    - flight-card.component.ts

1. Öffnen Sie die Datei _flight-card.component.ts_ und spendieren Sie ihr die folgenden Member:

    ```TypeScript
    @Component({
      selector: 'flight-card',
      templateUrl: './flight-card.component.html'
    })
    export class FlightCardComponent implements OnInit {

      constructor() { }

      @Input() item: Flight;
      @Input() selected: boolean;
      @Output() selectedChange = new EventEmitter<boolean>();

      ngOnInit() {
      }

      select() {
        this.selected = true;
        this.selectedChange.next(this.selected);
      }

      deselect() {
        this.selected = false;
        this.selectedChange.next(this.selected);
      }

    }
    ```

 Beachten Sie, dass hier der Selektor _flight-card_ festgelegt wurde.

1. Öffnen Sie das Template dieser Komponente (``flight-card.component.html``). Erweitern Sie diese Datei, sodass die Karte dargestellt wird:

    ```TypeScript
    <div
    class="card"
    [ngStyle]="{'background-color': (selected) ? 'rgb(204, 197, 185)' : 'white' }">

      <div class="header">
      <h2 class="title">{{item.from}} - {{item.to}}</h2>
      </div>
      <div class="content">
      <p>Flight-No.: #{{item.id}}</p>
      <p>Date: {{item.date | date:'dd.MM.yyyy HH:mm'}}</p>

      <p>
      <button
        class="btn btn-default"
        *ngIf="!selected"
        (click)="select()">Select</button>
      <button
        class="btn btn-default"
        *ngIf="selected"
        (click)="deselect()">Remove</button>

      </p>

      </div>
    </div>
    ```

    Beachten Sie die Datenbindungsausdrücke in diesem Template.

1. Wechseln Sie in die Datei _flight-booking.module.ts_. Vergewissern Sie sich, dass hier die neue _FlightCardComponent_ registriert wird.

    <details>
    <summary>Code anzeigen</summary>
    <p>
    
    ```TypeScript
    @NgModule({
    imports: [
      CommonModule,
      FormsModule,
      SharedModule
    ],
    declarations: [
      FlightSearchComponent,
      FlightCardComponent  // <-- Diese Zeile ist wichtig!
    ],
    providers:[ ],
    exports: [
      FlightSearchComponent
    ]
    })
    export class FlightBookingModule { }
    ```
    
    </p>
    </details>

1. Öffnen Sie die Datei _flight-search.component.ts_ und ergänzen Sie die eine Eigenschaft _basket_:

    ```TypeScript
    export class FlightSearchComponent implements OnInit {

      from: string;
      to: string;
      flights: Array<Flight> = [];
      selectedFlight: Flight;


      basket: object = {   // <-- Neue Eigenschaft
      "3": true,
      "5": true
      };

      […]
    }
    ```

1. Öffnen Sie die Datei _flight-search.component.html_. Kommentieren Sie die tabellarische Ausgabe der gefundenen Flüge aus.

1. Nutzen Sie anstatt der Tabelle die neue das Element ``flight-card`` um die gefundenen Flüge darzustellen. Erstellen Sie dazu eine explizite Bindung für die Eigenschaften ``item``, ``selected`` und ``selectedChange``.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```HTML
    <div class="row">
      <div *ngFor="let f of flights" 
      class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
      <flight-card
        [item]="f"
        [selected]="basket[f.id]"
        (selectedChange)="basket[f.id] = $event">
      </flight-card>
      </div>
    </div>
    ```

    </p>
    </details>


1. Aktualisieren Sie am Ende des Templates auch den Warenkorb, sodass hier die neue Eigenschaft ``basket`` anstatt von ``selectedFlight`` ausgegeben wird.

    <details>
    <summary>Code anzeigen</summary>
    <p>
    
    ```HTML
    <div class="card">
      <div class="content">
      <pre>{{ basket | json }}</pre>
      </div>
    </div>
    ```
    
    </p>
    </details>

1. Testen Sie Ihre Lösung.

1. Nutzen Sie beim Aufruf der _FlugCardComponent_ anstatt der Bindings für _selected_ und _selectedChanged_ ein Two-Way-Binding unter Verwendung der "Banana-in-a-Box-Syntax".

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```TypeScript
    <div class="row">
      <div *ngFor="let f of flights" 
      class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
      <flight-card
        [item]="f"
        [(selected)]="basket[f.id]">
      </flight-card>
      </div>
    </div>
    ```

    </p>
    </details>


1. Testen Sie Ihre Lösung.

### Bonus: FlightStatusToggleComponent \*\*

Erstellen Sie eine _StatusToggleComponent_, die das Flag delayed eines Fluges per Two-Way-Binding entgegennimmt und als Link anzeigt. Bei jedem Klick auf diesen Link soll der Status gewechselt werden. Die Komponente soll wie folgt im Template der FlightCardComponent aufgerufen werden werden können:

```HTML
<status-toggle [(status)]="item.delayed"></status-toggle>
```

### Bonus: Content Projection **

In dieser Bonus-Übung schaffen Sie die Möglichkeit, die Darstellung der _FlightCardComponent_ zu erweitern, indem Sie beim Aufruf zusätzlich anzuzeigendes HTML übergeben.

1. Öffnen Sie die Datei flight-search.component.html und übergeben Sie an die_FlightCardComponent_ zusätzliches HTML:

    ```HTML
    <flight-card […]>
      <pre>{{ f | json }}</pre>
    </flight-card> 
    ```

1. Platzieren Sie im **Template der**  **FlightCardComponent** das Element _ng-content_, um anzuzeigen, wo das übergebene Markup anzuzeigen ist:

    ```HTML
    […]
    <div class="content">
      <p>Flight-No.: #{{item.id}}</p>
      <p>Date: {{item.date | date:'dd.MM.yyyy HH:mm'}}</p>

        <ng-content></ng-content>

      […]
    </div>
    […]
    ```

1. Testen Sie Ihre Lösung.

1. Ergänzen Sie das Template, sodass es nun das Element _ng-content_ zwei Mal verwendet – einmal im oberen Bereich und einmal im unteren Bereich der Komponente:

    ```HTML
    […]
    <div class="content">
      <ng-content select=".top"></ng-content>

      <p>Flight-No.: #{{item.id}}</p>
      <p>Date: {{item.date | date:'dd.MM.yyyy HH:mm'}}</p>

      <ng-content select=".bottom"></ng-content>

      […]
    </div>
    […]
    ```

    Um Angular zu zeigen, was in die einzelnen mit _ng-content_ definierten Platzhalter einzufügen ist, erhalten diese über die Eigenschaft _select_ einen CSS-Selektor, der einen Teil des übergebenen Markups adressiert. Der Selektor _.top_ sucht im Markup beispielsweise nach einem Element mit der Klasse _top_ und fügt es in das jeweilige _ng-content_-Element ein.

1. Öffnen Sie die Datei _flight-search.component.html_. Übergeben Sie beim Aufruf der _flight-card_ Elemente für die beiden definierten Platzhalter:

    ```HTML
    <flight-card [...]>
      <h1 class="top">Flight</h1>
      <pre class="bottom">{{ f | json }}</pre>
    </flight-card>
    ```

1. Testen Sie Ihre Lösung.
