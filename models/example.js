var mongoose = require('mongoose')
    , Schema = mongoose.Schema

var authorSchema = Schema({
    name    : String,
    stories : [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

var storySchema = Schema({
    author : { type: Schema.Types.ObjectId, ref: 'Author' },
    title    : String,
});

var Story  = mongoose.model('Story', storySchema);
var Author = mongoose.model('Author', authorSchema);
var bob = new Author({ name: 'Bob Smith' });

bob.save(function (err) {
    if (err) return handleError(err);

    //Bob now exists, so lets create a story
    var story = new Story({
        title: "Bob goes sledding",
        author: bob._id    // assign the _id from the our author Bob. This ID is created by default!
    });

    story.save(function (err) {
        if (err) return handleError(err);
        // Bob now has his story
    });
});