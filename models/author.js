var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var AuthorSchema = Schema(
    {
        first_name: {type: String, required: true, max: 100},
        family_name: {type: String, required: true, max: 100},
        date_of_birth: {type: Date},
        date_of_death: {type: Date}
    }
);

// Virtual for author's full name
AuthorSchema
    .virtual('name')
    .get(function () {
        return this.family_name + ', ' + this.first_name;
    });

// Virtual for author's URL
AuthorSchema
    .virtual('url')
    .get(function () {
        return '/catalog/author/' + this._id;
    });

// Virtual for author's date of birth
AuthorSchema
    .virtual('dob')
    .get(function () {
        return moment(this.date_of_birth).format('Do MMMM, YYYY');
    });

//Virtual for author's date of death
AuthorSchema
    .virtual('dod')
    .get(function () {
        if(this.date_of_death)
            return moment(this.date_of_death).format('Do MMMM, YYYY');
        else return 'Present';
    });

//Export model
module.exports = mongoose.model('Author', AuthorSchema);