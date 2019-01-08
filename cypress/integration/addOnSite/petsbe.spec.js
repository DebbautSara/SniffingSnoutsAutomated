/*
* TODO
* Size . is not put on website / automated
*      . will be dog only ? > adapt json and xls
* Check all sites and mark animals in xls
*
*
*
*/

describe('Lets add an animal to the pets.be website', function () {
    it('Lets visit the pets.be website ', function () {
        cy.visit('http://pets.be/');
        //  });

        //  it('Lets login', function () {
        //todo check if login on page
        cy.contains('Login').click();
        cy.url().should('include', '/login');

        let email = Cypress.env('email');
        let password = Cypress.env('password');

        cy.get('#edit-name').type(email);
        cy.get('#edit-pass').type(password);
        cy.get('form').submit();
        cy.url().should('include', '/members/sniffing-snouts-vzw');
        //  });

        // it('Lets add a pet', function () {
        cy.contains('Add a rescue pet').click();
        cy.url().should('include', '/add/rescuepet');

        cy.fixture("overviewPets_2018.01.04.json").then(pets => { //TODO > ADAPT THE JSON FILE NAME
            pets.forEach(pet => {
                if (pet['id'] !== '' && pet['websites']['pets'] === '' && pet['status'] === 'available') {

                    // no need to set status
                    // cy.get('#edit-field-rescuepet-status-und').select(pet['status']);
                    cy.get('#edit-field-rescuepet-name-und-0-value').type(pet['name'].toString());
                    cy.get('#edit-field-rescuepet-type-und').select(pet['type']);
                    cy.wait(500);
                    cy.contains('Switch to plain text editor').click();
                    cy.wait(100);
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
                    }

                    if (pet['type'] === 'cat') {
                        cy.get('#edit-field-rescuepet-cat-age-und').select(pet['ageInText']);
                        cy.get('#edit-field-cat-lifetsyle-und').select(pet['cat']['lifeStyle']);
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
                        cy.wait(10000);
                        cy.get('#edit-field-photo-und--2-ajax-wrapper').should('not.contain', 'could not be uploaded')
                    }

                    cy.get('#edit-field-contact-und-0-value').type("sniffingsnoutsopvang@gmail.com");

                    // TODO click submit button and verify the result

                    //if all is well
                    pet['websites']['pets'] = 'OK';
                    cy.writeFile('/cypress/fixtures/overviewPets.json', pets)
                }
            })
        });
    });
});
