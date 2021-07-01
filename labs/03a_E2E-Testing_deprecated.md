# Angular-Workshop: E2E-Testing

- [Angular-Workshop: E2E-Testing](#angular-workshop-e2e-testing)
  - [Vorbereitung](#vorbereitung)
  - [E2E-Test erstellen: Page Title](#e2e-test-erstellen-page-title)
  - [E2E-Test erstellen: Flight Search](#e2e-test-erstellen-flight-search)

## Vorbereitung

1. Falls noch vorhanden, löschen Sie alle ``.e2s-spec.ts``-Dateien aus dem Ordner ``/e2e/src``. Diese Dateien enthalten die von der CLI generierten Testfälle, welche im Laufe der Schulung nicht gepflegt wurden und deswegen fehlschlagen würden.

1. Aktualisieren Sie die Konfiguration für den E2E-Test in der Datei ``/e2e/protractor.conf.js``, damit dieser unter Port 4299 startet:

    ```typescript
    exports.config = {
    [...]
    baseUrl: 'http://localhost:4299/',
    [...]
    };
    ```

1. Passen Sie auch den Skript-Aufruf in der ``package.json`` an:

    ```typescript
    [...]
    "scripts": {
        "ng": "ng",
        "start": "ng serve",
        "build": "ng build",
        "test": "ng test",
        "lint": "ng lint",
        "e2e": "ng e2e --port 4299"
    },
    [...]
    ```

## E2E-Test erstellen: Page Title

1. Erstellen Sie im Ordner ``/e2e/src`` die neue Datei ``check-page-title.e2e-spec.ts`` und implementieren Sie einen Test, der den Title der Angular Wep App prüft.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```typescript
    describe('Page Title E2E Test', () => {
        beforeEach(() => {
            browser.get('http://localhost:4299');
        });

        it('should verify the page title', () => {
            // Asynchronous events are handled by the testing environment
            const pageTitle = browser.getTitle();
            expect(pageTitle).toEqual('Flight42');
        });

        it('should verify the page title manually', (done) => {
            // Asynchronous events are handled manually by providing a callback function to the promise then method
            browser.getTitle()
            .then(function (pageTitle) {
                expect(pageTitle).toEqual('Flight42');
                done();
            });
        });
    });
    ```

    </p>
    </details>

    Sie finden hier eine synchron and eine asynchron implementierte Variante.

1. Um den Test zu starten, können Sie den Befehl ``npm run e2e`` verwenden.
 

## E2E-Test erstellen: Flight Search

1. Erstellen Sie im Ordner ``/e2e/src`` die neue Datei ``flight-search.e2e-spec.ts`` und implementieren Sie einen Test, der die Flug Suche testet.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```typescript
    describe('Flight Search E2E Test', () => {
        let from: ElementFinder;
        let to: ElementFinder;
        let search: ElementFinder;
        let flights: ElementArrayFinder;
        let firstFlight: ElementFinder;
        let card: ElementFinder;

        beforeEach(() => {
            browser.get('http://localhost:4299');
            // Maximize browser to show sidebar and flight-search item
            browser.manage().window().maximize();
            
            // Navigate to flight-search component
            const navigate = element(by.css('[routerlink="flight-booking/flight-search"]'));
            navigate.click();
            
            from = element(by.css('input[name=from]'));
            from.clear();
            from.sendKeys('Graz');

            to = element(by.css('input[name=to]'));
            to.clear();
            to.sendKeys('Hamburg');

            search = element(by.cssContainingText('button', 'Search'));
            search.click();

            flights = element.all(by.tagName('app-flight-card'));
            firstFlight = flights.first();
            card = firstFlight.element(by.tagName('mat-card'));
        });

        [...]
    });
    ```

    </p>
    </details>
    
1. Implementieren Sie einen Test der prüft wie viele Flüge gefunden werden. Passen Sie den Erwartungswert an das reale Suchergebnis an.

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```typescript
    describe('Flight Search E2E Test', () => {
        [...]

        beforeEach(() => {
            [...]
        });

        it('should show ten flight cards after search', () => {
            expect(flights.count()).toBe(10);
        });
    });
    ```

    </p>
    </details>

1. Implementieren Sie einen Test der prüft ob die erwartete Hintergrundfarbe angezeigt wird

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```typescript
    describe('Flight Search E2E Test', () => {
        [...]

        beforeEach(() => {
            [...]
        });

        it('should verify card background color change: initially/unselected, after mouse click select', () => {
            const selectFlight = firstFlight.element(by.cssContainingText('button mat-icon', 'add'));
            const white = 'rgba(255, 255, 255, 1)';
            const selectedColor = 'rgba(176, 196, 222, 1)';

            // Check CSS background-color by name
            let cardBackground = card.getAttribute('style');
            expect(cardBackground).toContain('background-color: white');

            // MouseClick to select flight card
            // Check CSS background-color as RGBA value
            browser.sleep(1000);
            browser.actions().mouseMove(selectFlight).perform();
            browser.actions().click().perform();
            cardBackground = card.getCssValue('background-color');
            expect(cardBackground).toBe(selectedColor);
            browser.sleep(1000);
        });
    });
    ```

    </p>
    </details>

1. Implementieren Sie einen Test der prüft ob der Search Button deaktiviert wird, falls die Property "from" nicht gesetzt ist. 

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```typescript
    describe('Flight Search E2E Test', () => {
        [...]

        beforeEach(() => {
            [...]
        });

        it('should disable search button if from is empty', () => {
            // Force interaction with sendKeys to update Angular binding for disabled button state
            from.clear();
            from.sendKeys(' ', protractor.Key.BACK_SPACE);
            expect(search.isEnabled()).toBe(false);
            browser.sleep(1000);
        });
    });
    ```

    </p>
    </details>

2. Implementieren Sie einen Test der prüft ob der Search Button aktiviert wird, falls die Properties "from" und "to" gesetzt sind. 

    <details>
    <summary>Code anzeigen</summary>
    <p>

    ```typescript
    describe('Flight Search E2E Test', () => {
        [...]

        beforeEach(() => {
            [...]
        });
        
        it('should enable search button if from and to have values', () => {
            from.clear();
            from.sendKeys('Graz');
            to.clear();
            to.sendKeys('Hamburg');
            expect(search.isEnabled()).toBe(true);
            browser.sleep(1000);
        });
    });
    ```

    </p>
    </details>

3. Um den Test zu starten, können Sie den Befehl ``npm run e2e`` verwenden.
