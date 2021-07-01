# Reactive Forms

- [Reactive Forms](#reactive-forms)
    - [Flüge editieren](#fl%C3%BCge-editieren)
    - [Standard-Validatoren nutzen](#standard-validatoren-nutzen)
    - [Benutzerdefinierte Validatoren](#benutzerdefinierte-validatoren)
    - [Parametrisierbare Validatoren](#parametrisierbare-validatoren)
    - [Multi-Field-Validatoren](#multi-field-validatoren)
    - [Bonus: Flug laden *](#bonus-flug-laden)
    - [Bonus: Flug speichern *](#bonus-flug-speichern)

## Flüge editieren

In dieser Übung erstellen Sie ein reaktives Formular zum Bearbeiten von Flügen.

1. **Falls** Sie noch keine ``FlugEditComponent`` haben: Legen Sie eine ``FlugEditComponent`` im ``FlightBookingModule`` an und rufen Sie sie im Template der ``FlightSearchComponent`` auf.

2. Importieren Sie das ``ReactiveFormsModule`` in Ihrem ``FlightBookingModule``.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```typescript
    [...]
    import { ReactiveFormsModule } from '@angular/forms';
    [...]

    @NgModule({
        [...]
        imports: [
            [...]
            ReactiveFormsModule
        ],
        [...]
    })
    export class FlightBookingModule {
    }
    ```
    
    </p>
    </details>

3. Spendieren Sie Ihrer ``FlightEditComponent`` eine FormGroup mit dem Namen ``editForm``.

    <details>
    <summary>Code anzeigen</summary>
    <p>
    
    ```typescript

    [...]
    import {FormGroup} from '@angular/forms';

    @Component({[...]})
    export class FlightEditComponent implements OnInit {

        editForm: FormGroup;
    
        [...]
    }
    ```
    
    </p>
    </details>


4. Lassen Sie sich den FormBuilder in die ``FlightEditComponent`` injizieren.

    <details>
    <summary>Code anzeigen</summary>
    <p>
    
    ```typescript
    import {[...], FormBuilder} from '@angular/forms';

    @Component({
        [...]
    })
    export class FlightEditComponent implements OnInit {
        [...]  
        constructor(private fb: FormBuilder) {
        }
        [...]
    }
    ```
    
    </p>
    </details>


5. Nutzen Sie den ``FormsBuilder`` in der Methode ``ngOnInit`` um eine ``FormGroup`` zu erzeugen, die einen Flug beschreibt. Legen Sie diese in ``editForm`` ab.

    <details>
    <summary>Code anzeigen</summary>
    <p>
    
    ```typescript

    export class FlightEditComponent implements OnInit {
        [...]  
        ngOnInit() {
            this.editForm = this.fb.group({
                id:   [1],
                from: [],
                to:   [],
                date: []
            });
        }
        [...]
    }
    ```
    
    </p>
    </details>


6. Erkunden Sie mit der Codevervollständigung Ihrer IDE/ Ihres Editors die Methoden von ``editForm``. Geben Sie zur Demonstration die Eigenschaften ``value``, ``valid``, ``touched`` und ``dirty`` auf der Konsole aus. 
    
    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```typescript

    export class FlightEditComponent implements OnInit {
        [...]  
        ngOnInit() {
            [...]
            console.log(this.editForm.value);
            console.log(this.editForm.valid);
            console.log(this.editForm.touched);
            console.log(this.editForm.dirty);
        }
        [...]
    }
    ```

    </p>
    </details>

7. Registrieren Sie sich bei ``editForm`` zusätzlich für ``valueChanges`` und geben Sie den erhaltenen Wert auch auf der Konsole aus, um sich über Änderungen am Formular am Laufenden zu halten.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```typescript

    export class FlightEditComponent implements OnInit {
    [...]  
        ngOnInit() {
            [...]
            this.editForm.valueChanges.subscribe(v => {
                console.debug('changes', v);
            });
        }
    [...]
    }
    ```

    </p>
    </details>
    
8. Wechseln Sie nun in die Datei ``flight-edit.component.html``. Erzeugen Sie dort ein Formular, dass Sie mit der ``FormGroups`` in der Eigenschaft ``editForm`` verknüpfen.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```html
    <form [formGroup]="editForm">
        <div class="form-group">
            <label>Id:</label>
            <input formControlName="id" class="form-control">
        </div>

        <div class="form-group">
            <label>Date:</label>
            <input formControlName="date" class="form-control">
        </div>

        <div class="form-group">
            <label>From:</label>
            <input formControlName="from" class="form-control">
        </div>

        <div class="form-group">
            <label>To:</label>
            <input formControlName="to" class="form-control">
        </div>

        <div class="form-group">
            <button (click)="save()" class="btn btn-default">Save</button>
        </div>

    </form>
    ```

    </p>
    </details>

9. Testen Sie Ihre Lösung. Falls alles funktioniert, sollten Sie jede Änderung, die Sie am Formular vornehmen, auf der Konsole angezeigt bekommen.

## Standard-Validatoren nutzen

In dieser Übung werden Sie das Feld from mit den Standardvalidatoren ``required`` und ``minlength`` validieren.

1. Wechseln Sie in die Datei flight-edit.component.ts und geben Sie beim Einrichten der FormGroup an, dass die Eigenschaft from mit ``required`` und ``minlength`` zu validieren ist. Letzterer Validator soll sicherstellen, dass zumindest drei Zeichen erfasst werden.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```typescript		
    [...]
    ngOnInit(): void {
        this.editForm = this.fb.group({
            id:   [1],
            from: [null, [Validators.required, Validators.minLength(3)]],
            to:   [null],
            date: [null]
        });

    }
    [...]		
    ```	

    </p>
    </details>

2. Wechseln Sie in die Datei ``flight-edit.component.html`` und geben Sie dort die Eigenschaft ``errors`` des Controls ``from`` aus.
 
    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```TypeScript
    <input  formControlName="from">		
    [...]           
    errors: {{editForm.controls['from'].errors | json}}	
    ```

    </p>
    </details> 
 
3. Nutzen Sie auch die Methode ``hasError`` des Controls, um herauszufinden, ob der Fehler ``minlength`` aufgetreten ist.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```TypeScript
    <input  formControlName="from" [...] >		
    [...]
    <div class="text-danger" *ngIf="editForm.controls['from'].hasError('minlength')">		
        ...minlength...
    </div>		
    ```

    </p>
    </details>

## Benutzerdefinierte Validatoren

In dieser Übung werden Sie einen eigenen Validator, der erfasste Städte gegen eine hardcodierte Whitelist prüft, für Ihr reaktives Formular schreiben. 

1. Erstellen Sie im Ordner ``shared`` einen Ordner ``validation`` (falls noch nicht vorhanden). 

2. Erstellen Sie im Ordner ``validation`` eine Datei ``city-validator.ts``. Platzieren Sie dort eine Validierungs-Funktion ``validateCity``, die ein ``AbstractControl`` entgegennimmt, die erfasste Stadt gegen hardcodierte Werte prüft und ein Fehlerbeschreibungsobjekt zurückliefert.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```typescript
    import {AbstractControl, ValidationErrors} from '@angular/forms';

    export function validateCity(c: AbstractControl) {
        const validCities: string[] = ['Vienna', 'Cologne', 'Bern'];
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
    ```

    </p>
    </details>

3. Wechseln Sie in die Datei ``flight-edit.component.ts`` und registrieren Sie dort die neue Validierungsfunktion für das Feld ``from``.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```typescript
    [...]
    import {validateCity} from '[...]';

    @Component({
        [...]
    })
    export class FlightEditComponent implements OnInit {
    
    ngOnInit(): void {
        this.editForm = this.fb.group({
            [...]
            from: [null, [[...], validateCity]],
            [...]
        });
    }
    ```
    </p>
    </details>

4. Wechseln Sie in die Datei ``flight-edit.component.html`` und prüfen Sie, ob der benutzerdefinierte Fehler ``city`` aufgetreten ist. Geben Sie in diesem Fall eine Fehlermeldung aus.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```html
    [...]
    <div class="text-danger" *ngIf="editForm.controls['from'].hasError('city')">
        ...city...
    </div>
    [...]
    ```

    </p>
    </details>

5. Testen Sie Ihre Lösung

## Parametrisierbare Validatoren

In dieser Übung werden Sie den Validator aus der letzten Übung parametrisierbar gestalten, sodass er die Eingaben gegen eine Whitelist, die als Parameter übergeben wird, prüft.

1. Wechseln Sie in die Datei ``city-validator.ts`` und erweitern Sie die Funktion ``validateCity``, sodass Sie eine Whitelist mit Städtenamen als String-Array entgegen nimmt und die eigentliche Validierungsfunktion zurückliefert.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```typescript
    import {[...], ValidatorFn} from '@angular/forms';
    [...]
    export function validateCity (validCities: string[]): ValidatorFn {
        return (c: AbstractControl) => {
            if (c.value && validCities.indexOf(c.value) === -1) {
                return {
                    city: {
                        actualValue: c.value,
                        validCities: validCities
                    }
                };
            }
            return null;
        };
    }
    ```

    </p>
    </details>

2. Öffnen Sie die Datei ``flight-edit.component.ts`` und aktualisieren Sie hier die Nutzung von ``validateCity``, sodass eine Whitelist übergeben wird.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```typescript
    [...]
    this.editForm = this.fb.group({
        [...]
        from: [null, [[...], validateCity(['Vienna', 'Berlin', 'Gleisdorf'])]],
        [...]
        });
    [...]
    ```

    </p>
    </details>

3. Testen Sie Ihre Lösung.

## Multi-Field-Validatoren

In dieser Übung werden Sie einen Multifield-Validator schreiben, der sicherstellt, dass in den Feldern ``from`` und ``to`` ein unterschiedlicher Wert erfasst ist.

1. Erstellen Sie unter shared/validation eine Datei ``round-trip-validator.ts``. 

2. Spendieren Sie dieser neuen Datei eine Validierungsfunktion ``validateRoundTrip``, welche eine ``FormGroup`` entgegennimmt, deren Controls ``from`` und ``to`` ermittelt sowie - falls diese existieren - prüft, ob sie den selben Wert aufweisen.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```typescript
    [...]   
    export function validateRoundTrip(g: FormGroup): object {
       let from = g.controls['from'];
       let to = g.controls['to'];

       if (!from || !to) return null;

       if (from.value === to.value) {
           return { roundTrip: true };
       }

       return null;
    }
    [...]
    ```
    </p>
    </details>

3. Wechseln Sie in die Datei ``flight-edit.component.ts`` und registrieren Sie den neuen Validator bei der ``FormGroup``.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```typescript
    [...]
    import {validateRountTrip} from '[...]';

    @Component({
        [...]
    })
    export class FlightEditComponent implements OnInit {
    
        ngOnInit(): void {
            [...]
            this.editForm.validator = validateRoundTrip;
        }

    }
    ```
    </p>
    </details>


4. Öffnen Sie die Datei ``flight-edit.component.html`` und prüfen Sie, ob der Fehler ``rountTrip`` aufgetreten ist. Geben Sie in diesem Fall eine Fehlermeldung aus.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```html
    [...]
    <div class="text-danger" *ngIf="editForm?.hasError('roundTrip')">
        ...roundTrip...
    </div>
    [...]
    ```

    </p>
    </details>

## Bonus: Flug laden *

Laden Sie einen beliebigen Flug, dessen id Sie vorerst mal als Konstante hinterlegen und schreiben Sie ihn in das Formular. Hierzu können Sie den Flug an die Methode ``patchValue`` von ``editForm`` übergeben.

**Erweiterung**: **Falls** Sie schon Routing implementiert haben, können Sie auch die Id des Fluges über die Url entgegennehmen.

## Bonus: Flug speichern *

Richten Sie eine Schaltfläche zum Speichern ein. Diese soll den aktuellen Flug aus dem Formular abrufen (``editForm.value``) und ihn an eine ``save``-Methode des ``FlightService``s übergeben. 

Diese soll den Flug mit der ``post``-Methode des ``HttpClients`` zum Server senden (``http.post<Flight>(url, flight).subscribe(...)``).

**Bitte beachten Sie**, dass Sie Datensätze mit den Ids 1 bis 5 nicht speichern können. Diese sind Präsentationen vorbehalten. Um einen neuen Datensatz einzufügen, vergeben Sie die Id 0.