/*
* TODO - short future
* 0. All up to date!
*
* TODO - long future
* 1. Write system to 'create' pets on the 3 websites (1/3)
* 2. Write system to 'update' pets on the 3 websites (needed when adopted ?)
* 3. Write system to 'delete' pets on the 3 websites (needed when adopted ?)
* 4. Create one script to do all CRUD on all websites based on xls/json
* 5. RSS on sniff snouts website / facebook - no more mails
* 6. Maybe we can just 'post' the forms > quicker
* 7. Remove petPictures from "adopted" pets
*/

describe('Lets add an animal to the pets.be website', function () {
    it('Lets visit the pets.be website ', function () {
        cy.visit('http://pets.be/');

        //todo check if login on page
        cy.contains('Login').click();
        cy.url().should('include', '/login');

        let email = Cypress.env('email');
        let password = Cypress.env('password');

        cy.get('#edit-name').type(email);
        cy.get('#edit-pass').type(password);
        cy.get('form').submit();
        cy.url().should('include', '/members/sniffing-snouts-vzw');

        cy.fixture("overviewPets.json").then(pets => { // TODO > ADAPT THE JSON FILE NAME
            pets.forEach(pet => {
                if (pet['websites']['pets'] === '' && pet['status'] === 'available') {
                    // it('Lets add a pet', function () {
                    cy.contains('Add a rescue pet').click();
                    cy.url().should('include', '/add/rescuepet');

                    // no need to set status
                    // cy.get('#edit-field-rescuepet-status-und').select(pet['status']);
                    cy.get('#edit-field-rescuepet-name-und-0-value').type(pet['name'].toString());
                    cy.get('#edit-field-rescuepet-type-und').select(pet['type']);
                    cy.wait(100);
                    cy.contains('Switch to plain text editor').click();
                    cy.wait(200);
                    cy.get('#edit-body-und-0-value').type(pet['comments'].toString());

                    if (pet['type'] === 'dog') {
                        cy.get('#edit-field-rescuepet-age-und').select(pet['ageInText']);
                        cy.get('#edit-field-rescuepet-breed-und-0-value').type(pet['dog']['breed']);
                        cy.get('#edit-field-house-trained-und').select(pet['dog']['houseTrained']);
                        cy.get('#edit-field-travel-by-car-und').select(pet['dog']['carTravel']);
                        cy.get('#edit-field-stay-alone-und').select(pet['dog']['stayAlone']);
                        cy.get('#edit-field-energy-level-und').select(pet['dog']['energyLevel']);
                        if (pet['gender'] === 'male') {
                            cy.get('#edit-field-dog-gender-und-maledog').click()
                        } else {
                            cy.get('#edit-field-dog-gender-und-femaledog').click()
                        }
                        if (pet['size'] === 'very small') {
                            cy.get('#edit-field-rescuepet-weight-und').select('1');
                        }
                        if (pet['size'] === 'small') {
                            cy.get('#edit-field-rescuepet-weight-und').select('2');
                        }
                        if (pet['size'] === 'medium') {
                            cy.get('#edit-field-rescuepet-weight-und').select('3');
                        }
                        if (pet['size'] === 'large') {
                            cy.get('#edit-field-rescuepet-weight-und').select('4');
                        }
                    }

                    if (pet['type'] === 'cat') {
                        cy.get('#edit-field-rescuepet-cat-age-und').select(pet['ageInText']);
                        if (typeof pet['cat']['lifeStyle'] !== 'undefined') {
                            cy.get('#edit-field-cat-lifetsyle-und').select(pet['cat']['lifeStyle']);
                        } else {
                            cy.get('#edit-field-cat-lifetsyle-und').select('inandout');
                        }
                        if (pet['gender'] === 'male') {
                            cy.get('#edit-field-cat-gender-und-malecat').click()
                        } else {
                            cy.get('#edit-field-cat-gender-und-femalecat').click()
                        }
                    }

                    cy.get('#edit-field-ok-with-dogs-und').select(pet['dogFriendly']);
                    cy.get('#edit-field-ok-with-cats-und').select(pet['catFriendly']);
                    cy.get('#edit-field-ok-with-kids-10yrs-minus-und').select(pet['smallKidFriendly']);
                    cy.get('#edit-field-ok-with-kids-10yrs-plus-und').select(pet['bigKidFriendly']);

                    if (pet['needsSpecialCare'] === 'yes') {
                        cy.get('#edit-field-needs-special-care > .form-item > .control-label > .checkbox-material > .check').click();
                        cy.get('#edit-field-special-care-description-und-0-value').type(pet['specialCareDescr']);
                    }
                    if (pet['vaccinated'] === 'no') {
                        cy.get('#edit-field-vaccinated > .form-item > .control-label > .checkbox-material > .check').click()
                    }
                    if (pet['microchipped'] === 'no') {
                        cy.get('#edit-field-microchipped > .form-item > .control-label > .checkbox-material > .check').click()
                    }
                    if (pet['desexed'] === 'no') {
                        cy.get('#edit-field-desexed > .form-item > .control-label > .checkbox-material > .check').click()
                    }
                    if (pet['wormed'] === 'no') {
                        cy.get('#edit-field-wormed > .form-item > .control-label > .checkbox-material > .check').click()
                    }
                    if (pet['heartWormTreated'] === 'yes') {
                        cy.get('#edit-field-heart-worm-treated > .form-item > .control-label > .checkbox-material > .check').click()
                    }

                    if (pet['photo'] === 'yes') { //todo can this be better? a dynamic > find folder by id, upload pics inside?
                        Cypress.Commands.add('dropFile',
                            {prevSubject: 'element'},
                            (subject, fileName) => {
                                return cy
                                    .fixture(fileName, 'base64')
                                    .then(Cypress.Blob.base64StringToBlob)
                                    .then(blob => {
                                        // instantiate File from `application` window, not cypress window
                                        return cy.window().then(win => {
                                            const file = new win.File([blob], fileName);
                                            const dataTransfer = new win.DataTransfer();
                                            dataTransfer.items.add(file);

                                            return cy.wrap(subject).trigger('drop', {
                                                dataTransfer,
                                            })
                                        })
                                    })
                            }
                        );
                        for (let i = 0; i < pet['photoCount']; i++) {
                            cy.get('#edit-field-photo-und-0-filefield-plupload-pud_filelist').dropFile('/petPictures/' + pet['id'] + '/' + (i + 1) + '.jpg')
                        }
                        cy.get('#edit-field-photo-und-0-filefield-plupload-upload-button').click();
                        cy.wait(5000);
                        cy.wait(5000); // todo there is a .waitUntil .. so we avoid waiting too long
                        cy.wait(5000);
                        cy.wait(5000);
                        cy.wait(5000);
                        cy.wait(5000);
                        cy.get('#edit-field-photo-und--2-ajax-wrapper').should('not.contain', 'could not be uploaded')
                    }

                    cy.get('#edit-field-contact-und-0-value').type("sniffingsnoutsopvang@gmail.com");

                    // if all is well
                    cy.get('#edit-submit').click();
                    cy.wait(5000);
                    cy.wait(5000); // todo .waitUntil contains ...

                    cy.contains('has been created.');

                    pet['websites']['pets'] = 'ADDED';
                    cy.writeFile('/cypress/fixtures/overviewPets.json', pets);
                    cy.wait(100);
                }
            })
        });
    });
});
