# Angular Workshop: Template Driven Forms

- [Angular Workshop: Template Driven Forms](#angular-workshop-template-driven-forms)
  - [Build-in Validatoren](#build-in-validatoren)
  - [Bonus: Komponente zum Anzeigen von Validierungsfehlern *](#bonus-komponente-zum-anzeigen-von-validierungsfehlern-)
  - [Eigener Validator](#eigener-validator)
  - [Parametrisierbarer Validator](#parametrisierbarer-validator)
  - [Bonus: Asynchroner Validator *](#bonus-asynchroner-validator-)
  - [Bonus: Multifield Validator *](#bonus-multifield-validator-)
  - [Bonus: Parametrisierbarer Multifield Validator **](#bonus-parametrisierbarer-multifield-validator-)
  - [Bonus: Asynchroner Multifield Validator ***](#bonus-asynchroner-multifield-validator-)
  - [Bonus: Formatiertes Datum in Textfeld ***](#bonus-formatiertes-datum-in-textfeld-)
  - [Bonus: Komponente zum Editieren eines Datums ***](#bonus-komponente-zum-editieren-eines-datums-)

## Build-in Validatoren

In dieser Übung werden Sie die Eingaben im Suchformular der ``FlightSearchComponent`` mit den Build-in Validatoren ``require``, ``minlength``, ``maxlength`` und ``pattern`` validieren und eventuelle Validierungsfehler ausgeben.

Sie können sich dabei am folgenden Ablauf orientieren:

1. Stellen Sie sicher, dass sich die Suchfelder in einem ``form``-Element befinden und richten Sie für dieses Element ein Handle ein. Stellen Sie außerdem sicher, dass jedes Eingabefeld ein ``name``-Attribut hat.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```html
    <form #form="ngForm">
        [...]
        <input name="from" [(ngModel)]="from" [...]>
        [...]
        <input name="to" [(ngModel)]="to" [...]>
        [...]
    </form>
    ```

    </p>
    </details>

2. Erweitern Sie das Suchfeld ``from`` um die oben genannten Validierungsattribute und geben Sie eventuelle Validierungsfehler aus.

    <details>
    <summary>Code anzeigen</summary>
    <p>
    
    ```html
    <input name="from" [(ngModel)]="from"   
           required		
           minlength="3"		
           maxlength="15"		
           pattern="[a-zA-Z ]*">		

    <pre>{{form?.controls['from']?.errors | json}}</pre>

    [...]
    <div class="text-danger" 
         *ngIf="form?.controls['from']?.hasError('minlength')">		
        ... minlength ...
    </div>		
    [...]
    ```
    
    </p>
    </details>

3. Testen Sie Ihre Lösung

## Bonus: Komponente zum Anzeigen von Validierungsfehlern *

Um nicht pro Eingabefeld immer und immer wieder auf dieselbe Weise die Validierungsfehler abfragen zu müssen, bietet sich der Einsatz einer zentralen Komponente an. Diese kann die Eigenschaft ``errors`` des validierten ``FormControls`` entgegennehmen. Der Ausdruck
``f?.controls['from']?.errors`` liefert zum Beispiel das nachfolgende Objekt, wenn sowohl der Validator ``minlength`` als auch ein eventuell selbst geschriebener ``city``-Validator fehlschlägt:

```json
{
  "minlength": {
    "requiredLength": 3,
    "actualLength": 1
  },
  "city": true
}
```

Schreiben Sie eine Komponente, die dieses ``errors``-Objekt entgegennimmt (``@Input() errors: any;``) und für die darin vermerkten Fehler jeweils eine Fehlermeldung ausgibt. Um zu prüfen, ob dieses Objekt existiert und ob es auf einen bestimmten Fehler hinweist, kann *ngIf verwendet werden:

```html
<div *ngIf="errors && errors['required']">
    This field is required.
</div>

<div *ngIf="errors && errors['minlength']">
    This field is too short.
</div>
```

Diese Komponente soll sich wie folgt aufrufen lassen:

```html
<div class="form-group">
    <label>From</label>
    <input class="form-control" [(ngModel)]="from" name="from" 
           required minlength="3">
    
    <flight-validation-errors [errors]="form?.controls['from']?.errors">
    </flight-validation-errors>
</div>
```

## Eigener Validator

In dieser Übung werden Sie einen eigenen Validator in Form einer Direktive bereitstellen. Dieser soll erfasste Städtenamen gegen eine hardcodierte Whitelist prüfen und wie folgt angewandt werden können:

```html
<input [(ngModel)]="from" name="from" city>
```

Sie können sich dabei am folgenden Ablauf orientieren:

1. Erstellen Sie im Ordner ``shared`` einen Unterordner ``validation``.

1. Richten Sie im neuen Unterordner eine Direktive ``CityValidatorDirective`` ein und vergeben Sie den Selektor ``[city]``.

1. Stellen Sie sicher, dass die neue Direktive im ``SharedModule`` **sowohl** deklariert **als auch** exportiert wird.

1. Richten Sie in der Direktive einen Multi-Provider ein, der sie an das Token ``NG_VALIDATORS`` bindet.

    <details>
    <summary>Code anzeigen</summary>
    <p>
    
    ```TypeScript
    @Directive({
        selector: '[city]',
        providers: [{
            provide: NG_VALIDATORS,
            useExisting: CityValidatorDirective,
            multi: true
        }]
    })
    export class CityValidatorDirective {
        [...]
    }    
    ```
    
    </p>
    </details>

2. Lassen Sie die Direktive das Interface ``Validator`` implementieren. Prüfen Sie in der Methode ``validate`` ob es sich bei der Eingabe um die Städte ``Hamburg`` oder ``Graz`` handelt. In allen anderen Fällen soll ein Fehler gemeldet werden.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```TypeScript
    @Directive({
    ...
    })
    export class CityValidatorDirective implements Validator {

        validate(c: AbstractControl): ValidationErrors | null {
            const validCities: string[] = ['Hamburg', 'Graz'];
            if (c.value && validCities.indexOf(c.value) === -1) {
                return {
                    city: {
                        actualValue: c.value,
                        validCities: validCities
                    }
                }
            }
            return null;
        }

    }
    ```

    </p>
    </details>

3. Wechseln Sie in die ``FlightSearchComponent`` und wenden Sie die neue Validierungsdirektive auf das Feld ``from`` an. Geben Sie im Fehlerfall eine Meldung aus.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```html
    <input name="from" [(ngModel)]="from"
           required		
           minlength="3"		
           maxlength="15"		
           pattern="[a-zA-Z ]*"
           city>	
    [...]
    <div *ngIf="form?.controls['from']?.hasError('city')">
        ... city ...
    </div>
    [...]
    ```

    </p>
    </details>

1. Testen Sie Ihre Lösung.

## Parametrisierbarer Validator

In dieser Übung werden Sie den Validator aus der letzten Übung parametrisieren, sodass die Whitelist mit den gültigen Städten übergeben werden kann:

```html
<input [(ngModel)]="from" name="from" [city]="['Graz', 'Hamburg']">
```

Sie können dabei dem folgenden Ablauf folgen:

1. Spendieren Sie der ``CityValidatorDirective`` eine mit ``@Input`` dekorierte Eigenschaft ``city`` vom Typ ``string[]``. Nutzen Sie diese Eigenschaft als Whitelist in der Methode ``validate``.

    <details>
    <summary>Code anzeigen</summary>
    <p>
    
    ```TypeScript
    @Directive({
    ...
    })
    export class CityValidatorDirective implements Validator {
    
        @Input() city: string[];

        validate(c: AbstractControl): ValidationErrors | null {
            if (c.value && this.city.indexOf(c.value) === -1) {
                return {
                    city: {
                        actualCity: c.value,
                        validCities: this.city
                    }
                }
            }
            return { };
        }
    }    
    ```
    
    </p>
    </details>

2. Wechseln Sie in die Datei ``flight-search.component.html`` und übergeben Sie beim Aufruf der Direktive für das Suchfeld ``from`` eine Whitelist.

```html
<input [(ngModel)]="from" name="from" [city]="['Graz', 'Hamburg']">
```

3. Testen Sie Ihre Lösung.

## Bonus: Asynchroner Validator *

In dieser Übung werden Sie einen asynchronen Validator schreiben, der die erfasste Städtenamen gegen die von der Web API unterstützten Flughäfen prüft.

Asynchrone Validatoren liefern das Validierungsergebnis zeitlich verzögert. Sie kommen z. B. zum Einsatz, wenn zur Validierung Web APIs einzubinden sind, da deren Antworten asynchron abgerufen werden.

Sie können sich dabei am folgenden Ablauf orientieren:

1. Richten Sie im Ordner ``shared/validation`` eine Direktive ``AsyncCityValidatorDirective`` ein und vergeben Sie den Selektor ``[asyncCity]``.

1. Stellen Sie sicher, dass diese im ``SharedModule`` **sowohl** deklariert **als auch** exportiert wird.

1. Richten Sie in der Direktive einen Provider ein, der sie an das Token ``NG_ASYNC_VALIDATORS`` bindet.

    <details>
    <summary>Code anzeigen</summary>
    <p>
    
    ```TypeScript
    @Directive({
        selector: '[asyncCity]',
        providers: [{
            provide: NG_ASYNC_VALIDATORS,
            useExisting: AsyncCityValidatorDirective,
            multi: true
        }]
    })
    export class AsyncCityValidatorDirective {
        [...]
    }    
    ```
    
    </p>
    </details>

2. Lassen Sie sich in den Konstruktor dieser Direktive den FlightService injizieren.

    <details>
    <summary>Code anzeigen</summary>
    <p>
    
    ```TypeScript
    @Directive({
        [...]
    })
    export class AsyncCityValidatorDirective {
        [...]
        constructor(private flightService: FlightService) {
        }
        [...]
    }    
    ```
    
    </p>
    </details>

2. Lassen Sie die Direktive das Interface ``AsyncValidator`` implementieren. Prüfen Sie in der Methode ``validate`` ob es in der Web API Flüge gibt, die von diesem Flughafen wegführen. 
 
    Sie können dazu die Methode ``find`` des ``FlightService`` aufrufen und für den Parameter ``from`` die aktuelle Eingabe sowie für den Parameter ``to`` einen Leerstring übergeben. 

    Mappen Sie das erhaltene Ergebnis mit der Methode ``map`` des Observables auf ein leeres Fehlerbeschreibungsobjekt, wenn Flüge gefunden wurden. Ansonsten mappen Sie es auf ein Objekt, dass den Fehler ``asyncCity`` anzeigt. Liefern Sie das von ``map`` erhaltene Observable zurück.


    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```TypeScript
    import { map, delay } from 'rxjs/operators';
    [...]

    @Directive({
    ...
    })
    export class AsyncCityValidatorDirective implements AsyncValidator {
        [...]
        constructor(private flightService: FlightService) {
        }
        [...]

        validate(c: AbstractControl): Observable<ValidationErrors | null> {
            return this.flightService
                       .find(c.value, '').pipe(
                            map(flights => (flights.length) > 0 ? {} : {asyncCity: true}),
                            delay(4000); // <-- Künstlicher Delay; Kann später entfernt werden...
                       );
        }

    }
    ```

    </p>
    </details>

3. Wechseln Sie in die ``FlightSearchComponent`` und wenden Sie die neue Validierungsdirektive auf das Feld ``from`` an. Geben Sie im Fehlerfall eine Meldung aus.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```html
    <input name="from" [(ngModel)]="from"
           required		
           minlength="3"		
           maxlength="15"		
           pattern="[a-zA-Z ]*"
           asyncCity
           city="Graz,Hamburg,Zürich">	
    [...]
    <div *ngIf="form?.controls['from']?.hasError('asyncCity')">
        ... asyncCity ...
    </div>
    [...]
    ```

    </p>
    </details>

3. Prüfen Sie auch mit der Eigenschaft ``pending`` des ``FormControls`` ob noch asynchrone Validierungen anstehen.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```html
    <div *ngIf="form?.controls['from']?.pending">
        ... Executing Async Validator ...
    </div>
    [...]
    ```

    </p>
    </details>

1. Testen Sie Ihre Lösung. **Beachten Sie dabei**, dass Angular asynchrone Validatoren erst ausführt, wenn keiner der synchronen Validatoren einen Fehler meldet. Tragen Sie bspw. ``Rom`` in die Whiteliste des synchronen Validators ein. Wenn Sie nun nach ``Rom`` suchen, werden alle synchronen Validatoren diesen Wert korrekt validieren und der neue asynchrone Validator wird einen Fehler liefern, da ``Rom`` in der Datenbank nicht eingetragen ist.

## Bonus: Multifield Validator *

Sie können auch Validatoren schaffen, die auf ein Formular angewandt werden und mehrere Felder berücksichtigen. Nutzen Sie die nachfolgenden Informationen dazu, um einen Validator, der Rundflüge verbietet (z. B. Flüge von Frankfurt nach Frankfurt) zu schreiben.
 
Hierzu muss der Selektor das gesamte Formular adressieren:

```TypeScript
@Directive({ 
    selector: 'form[roundTrip]',
    providers: [...]
})
[...]
```

Die ``validate``-Methode kann in diesem Fall das übergebene ``AbstractControl`` in eine ``FormGroup`` umwandeln:

```TypeScript
validate(c: AbstractControl): object {

    let group: FormGroup = c as FormGroup; // Typumwandlung

    let fromCtrl = group.controls['from'];
    let toCtrl = group.controls['to'];

    if (!fromCtrl || !toCtrl) return { };

    […]
}
```

Danach kann man auf die einzelnen Controls zugreifen. In diesem Beispiel sind die Namen der Controls hartcodiert. Allerdings könnte man diese auch, wie in einer der letzten Übungen, per Datenbindung übergeben. 

Mit diesen Controls kann eine Validierung durchgeführt werden:

```TypeScript
if (fromCtrl.value === toCtrl.value) {
    return {
        roundTrip: true
    }
}

return { }
```

Nach dem **Registrieren und Exportieren** beim ``SharedModule``, kann die Validierungs-Direktive beim jeweiligen ``from``-Element eingesetzt werden:

```html
<form #form="ngForm" roundTrip>
    <div *ngIf="form?.hasError('roundTrip')">...roundTrip...</div>
    [...]
</form>
```

## Bonus: Parametrisierbarer Multifield Validator **

Der Validator im letzten Beispiel greift hardcodiert auf die Felder ``from`` und ``to`` zu. Schaffen Sie eine Möglichkeit, diese Informationen per Datenbindung zu übergeben. Nutzen Sie dazu Eigenschaften mit dem Dekorator ``@Input``.

## Bonus: Asynchroner Multifield Validator ***

Kombinieren Sie die Informationen aus den letzten Übungen, um einen asynchronen Multifield Validator zu schreiben. Dieser soll prüfen, ob es Flüge gibt, die von ``from`` nach ``to`` führen.

## Bonus: Formatiertes Datum in Textfeld ***

Schreiben Sie eine Direktive mit deren Hilfe das Geburtsdatum eines Passagiers als formatiertes Datum in einem Textfeld dargestellt und editiert werden kann. Infos dazu finden Sie im Blog des Trainers unter https://www.softwarearchitekt.at/post/2016/01/11/parser-und-formatter-in-angular-2.aspx.

## Bonus: Komponente zum Editieren eines Datums ***

Schreiben Sie eine Komponente zum Editieren des Geburtsdatums eines Passagiers. Damit diese Komponente mit dem Forms-Handling von Angular zusammenspielt, müssen Sie das Interface ControlValueAccessor implementieren. Informationen dazu finden Sie im Blog des Trainers unter https://www.softwarearchitekt.at/post/2016/06/10/eigene-formular-steuerelemente-fur-angular-2-schreiben.aspx
