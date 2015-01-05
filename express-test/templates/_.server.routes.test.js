'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	<%= classifiedModelName %> = mongoose.model('<%= classifiedModelName %>'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, <%= camelizedModelName %>;

/**
 * <%= classifiedModelName %> routes tests
 */
describe('<%= classifiedModelName %> CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new <%= camelizedModelName %>
		user.save(function() {
			<%= camelizedModelName %> = {
				title: '<%= classifiedModelName %> Title',
				content: '<%= classifiedModelName %> Content'
			};

			done();
		});
	});

	it('should be able to save an <%= camelizedModelName %> if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new <%= camelizedModelName %>
				agent.post('/<%= slugifiedPluralModelName %>')
					.send(<%= camelizedModelName %>)
					.expect(200)
					.end(function(<%= camelizedModelName %>SaveErr, <%= camelizedModelName %>SaveRes) {
						// Handle <%= camelizedModelName %> save error
						if (<%= camelizedModelName %>SaveErr) done(<%= camelizedModelName %>SaveErr);

						// Get a list of <%= slugifiedPluralModelName %>
						agent.get('/<%= slugifiedPluralModelName %>')
							.end(function(<%= camelizedModelName %>GetErr, <%= camelizedModelName %>GetRes) {
								// Handle <%= camelizedModelName %> save error
								if (<%= camelizedModelName %>GetErr) done(<%= camelizedModelName %>GetErr);

								// Get <%= camelizedModelName %> list
								var <%= camelizedModelName %> = <%= camelizedModelName %>GetRes.body;

								// Set assertions
								(<%= camelizedModelName %>[0].user._id).should.equal(userId);
								(<%= camelizedModelName %>[0].title).should.match('<%= classifiedModelName %> Title');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save an <%= camelizedModelName %> if not logged in', function(done) {
		agent.post('/<%= slugifiedPluralModelName %>')
			.send(<%= camelizedModelName %>)
			.expect(401)
			.end(function(<%= camelizedModelName %>SaveErr, <%= camelizedModelName %>SaveRes) {
				// Call the assertion callback
				done(<%= camelizedModelName %>SaveErr);
			});
	});

	it('should not be able to save an <%= camelizedModelName %> if no title is provided', function(done) {
		// Invalidate title field
		<%= camelizedModelName %>.title = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new <%= camelizedModelName %>
				agent.post('/<%= slugifiedPluralModelName %>')
					.send(<%= camelizedModelName %>)
					.expect(400)
					.end(function(<%= camelizedModelName %>SaveErr, <%= camelizedModelName %>SaveRes) {
						// Set message assertion
						(<%= camelizedModelName %>SaveRes.body.message).should.match('Title cannot be blank');

						// Handle <%= camelizedModelName %> save error
						done(<%= camelizedModelName %>SaveErr);
					});
			});
	});

	it('should be able to update an <%= camelizedModelName %> if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new <%= camelizedModelName %>
				agent.post('/<%= slugifiedPluralModelName %>')
					.send(<%= camelizedModelName %>)
					.expect(200)
					.end(function(<%= camelizedModelName %>SaveErr, <%= camelizedModelName %>SaveRes) {
						// Handle <%= camelizedModelName %> save error
						if (<%= camelizedModelName %>SaveErr) done(<%= camelizedModelName %>SaveErr);

						// Update <%= camelizedModelName %> title
						<%= camelizedModelName %>.title = 'WHY YOU GOTTA BE SO MEAN?';

						// Update an existing <%= camelizedModelName %>
						agent.put('/<%= slugifiedPluralModelName %>/' + <%= camelizedModelName %>SaveRes.body._id)
							.send(<%= camelizedModelName %>)
							.expect(200)
							.end(function(<%= camelizedModelName %>UpdateErr, <%= camelizedModelName %>UpdateRes) {
								// Handle <%= camelizedModelName %> update error
								if (<%= camelizedModelName %>UpdateErr) done(<%= camelizedModelName %>UpdateErr);

								// Set assertions
								(<%= camelizedModelName %>UpdateRes.body._id).should.equal(<%= camelizedModelName %>SaveRes.body._id);
								(<%= camelizedModelName %>UpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of <%= slugifiedPluralModelName %> if not signed in', function(done) {
		// Create new <%= camelizedModelName %> model instance
		var <%= camelizedModelName %>Obj = new <%= classifiedModelName %>(<%= camelizedModelName %>);

		// Save the <%= camelizedModelName %>
		<%= camelizedModelName %>Obj.save(function() {
			// Request <%= slugifiedPluralModelName %>
			request(app).get('/<%= slugifiedPluralModelName %>')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single <%= camelizedModelName %> if not signed in', function(done) {
		// Create new <%= camelizedModelName %> model instance
		var <%= camelizedModelName %>Obj = new <%= classifiedModelName %>(<%= camelizedModelName %>);

		// Save the <%= camelizedModelName %>
		<%= camelizedModelName %>Obj.save(function() {
			request(app).get('/<%= slugifiedPluralModelName %>/' + <%= camelizedModelName %>Obj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('title', <%= camelizedModelName %>.title);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete an <%= camelizedModelName %> if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new <%= camelizedModelName %>
				agent.post('/<%= slugifiedPluralModelName %>')
					.send(<%= camelizedModelName %>)
					.expect(200)
					.end(function(<%= camelizedModelName %>SaveErr, <%= camelizedModelName %>SaveRes) {
						// Handle <%= camelizedModelName %> save error
						if (<%= camelizedModelName %>SaveErr) done(<%= camelizedModelName %>SaveErr);

						// Delete an existing <%= camelizedModelName %>
						agent.delete('/<%= slugifiedPluralModelName %>/' + <%= camelizedModelName %>SaveRes.body._id)
							.send(<%= camelizedModelName %>)
							.expect(200)
							.end(function(<%= camelizedModelName %>DeleteErr, <%= camelizedModelName %>DeleteRes) {
								// Handle <%= camelizedModelName %> error error
								if (<%= camelizedModelName %>DeleteErr) done(<%= camelizedModelName %>DeleteErr);

								// Set assertions
								(<%= camelizedModelName %>DeleteRes.body._id).should.equal(<%= camelizedModelName %>SaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete an <%= camelizedModelName %> if not signed in', function(done) {
		// Set <%= camelizedModelName %> user
		<%= camelizedModelName %>.user = user;

		// Create new <%= camelizedModelName %> model instance
		var <%= camelizedModelName %>Obj = new <%= classifiedModelName %>(<%= camelizedModelName %>);

		// Save the <%= camelizedModelName %>
		<%= camelizedModelName %>Obj.save(function() {
			// Try deleting <%= camelizedModelName %>
			request(app).delete('/<%= slugifiedPluralModelName %>/' + <%= camelizedModelName %>Obj._id)
			.expect(401)
			.end(function(<%= camelizedModelName %>DeleteErr, <%= camelizedModelName %>DeleteRes) {
				// Set message assertion
				(<%= camelizedModelName %>DeleteRes.body.message).should.match('User is not logged in');

				// Handle <%= camelizedModelName %> error error
				done(<%= camelizedModelName %>DeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		<%= classifiedModelName %>.remove().exec();
		done();
	});
});