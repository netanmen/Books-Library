import React, { Component } from 'react';
import BookList from './BookList';
import ModalComponent from './ModalComponent';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			books: [],
			id: '',
			title: '',
			author: '',
			publishedDate: '',

			errors: {title: '', author: '', publishedDate: ''},
			showModal: false
		};
	}

	componentDidMount() {
		const query = 'coding'
		const maxResults = '12'

		fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${maxResults}&langRestrict=en`)
		.then(response => response.json())
		.then(data => {
			const fetchedBooks = [];
			data.items.forEach((book,i) => {
				fetchedBooks[i] = {
					id: book.id,
					title: book.volumeInfo.title,
					author: book.volumeInfo.authors[0],
					publishedDate: ((book.volumeInfo.publishedDate.length < 8) ? 
						(book.volumeInfo.publishedDate.slice(0,4) + '-01-01') : 
						book.volumeInfo.publishedDate)
				};
			});
			this.setState({ books: fetchedBooks });
		});
	}

	handleEdit = (e) => {
		const editBook = this.state.books.filter(book => book.id === e.target.value)[0];
		this.setState({ id: editBook.id, title: editBook.title, author: editBook.author, publishedDate: editBook.publishedDate });
		this.toggleModal();
	}

	handleAdd = (e) => {
		this.setState({ id: '', title: '', author: '', publishedDate: '' });
		this.toggleModal();
	}

	handleDelete = (e) => {
		const updatedBooks = this.state.books.filter(book => book.id !== e.target.value);
		this.setState({ books: updatedBooks });
	}

	toggleModal = (e) => {
		const showModal = this.state.showModal;
		this.setState({ showModal: !showModal });
	}

	handleChange = (e) => {
		switch(e.target.name) {
			case 'title':
			this.setState({ title: e.target.value });
				break;
			case 'author':
			this.setState({ author: e.target.value });
				break;
			case 'publishedDate':
			this.setState({ publishedDate: e.target.value });
				break;
			default:
				break;
		}
	}

	handleSubmit = (e) => {
		e.preventDefault();

		const inputObj = {
			title: this.state.title, 
			author: this.state.author, 
			publishedDate: this.state.publishedDate
		};
		if (this.validateForm(inputObj) === true) {
			let updatedBooks = this.state.books;

			if (this.state.id !== '') {
				const indexOfEditBook = this.state.books.findIndex(book => book.id === this.state.id);
				updatedBooks[indexOfEditBook].title = this.state.title;
				updatedBooks[indexOfEditBook].author = this.state.author;
				updatedBooks[indexOfEditBook].publishedDate = this.state.publishedDate;
			} else {
				const newId = Math.floor(Math.random() * 100000).toString();
				const newBook = {
					id: newId, 
					title: this.state.title,
					author: this.state.author,
					publishedDate: this.state.publishedDate
				};
				updatedBooks.unshift(newBook);
			}
			this.toggleModal();			
			this.setState({ 
				books: updatedBooks,
				id: '', 
				title: '', 
				author: '', 
				publishedDate: '', 
				errors: {title: '', author: '', publishedDate: ''} 
			});
		}
	}

	validateForm = (inputObj) => {
		const updatedErrors = this.state.errors;

		console.log('inputObj', inputObj);

		Object.keys(inputObj).forEach(key => {
			if (!inputObj[key].length) {
				switch(key) {
					case 'title':
					updatedErrors.title = 'Title can not be empty.';
					break;
					case 'author':
					updatedErrors.author = 'Author can not be empty.';
					break;
					case 'publishedDate':
					updatedErrors.publishedDate = 'Please enter valid date.';
					break;
					default:
					break;
				}
			} else if (inputObj[key].length) {
				switch(key) {
					case 'title':
					updatedErrors.title = '';
					break;
					case 'author':
					updatedErrors.author = '';
					break;
					case 'publishedDate':
					updatedErrors.publishedDate = '';
					break;
					default:
					break;
				}
			}
		});

		const isFormValid = Object.keys(updatedErrors).every(key => updatedErrors[key] === "");
		this.setState({ errors: updatedErrors, isFormValid: isFormValid });
		return isFormValid;
	}

	render() {
		const { books, title, author, publishedDate, errors, showModal } = this.state;

		return !books.length ? 
			(
				<div className='d-flex flex-column'>
					<h1 className='display-3 text-center m-2'>
						No books yet...
					</h1>
					<h6 className='text-center m-3'>Or... you just deleted all your books. Go ahead and add your first book now.</h6>
					<button type="button" className="btn btn-primary border-dark align-self-center text-center" onClick={this.handleAdd}>
						Add new book
					</button>
					<ModalComponent 
						title={title} author={author} publishedDate={publishedDate} 
						errors={errors} handleChange={this.handleChange} handleSubmit={this.handleSubmit} 
						toggleModal={this.toggleModal} showModal={showModal}
					/>
				</div>
			) :
			(
				<div className='d-flex flex-column'>
					<h1 className='display-3 text-center m-2'>Fully Booked</h1>	
					<button type="button" className="btn btn-primary border-dark align-self-center m-3" onClick={this.handleAdd}>
						Add new book
					</button>
					<BookList 
						books={books} handleEdit={this.handleEdit} 
						handleDelete={this.handleDelete} toggleModal={this.toggleModal}
					/>
					<ModalComponent 
						title={title} author={author} publishedDate={publishedDate} 
						errors={errors} handleChange={this.handleChange} handleSubmit={this.handleSubmit} 
						toggleModal={this.toggleModal} showModal={showModal}
					/>
				</div>
			);
	}
}

export default App;

// TODO: 1. Add hover transition to Cards? looks good/slow..
//		 2. Add filter to titles => titleCase and remove non-english characters. FIRST
//		 3. Add validition => validate that submitted title doesn't exist in bookList. SECOND
//		 4. Use Redux. THIRD
//		 5. Find nice fonts (and maybe other colors as well).
//		 6. Change buttons' text to icons (edit/delete/add...)
//		 7. Change the newBook in state from seperate variables into object. FIFTH
//		 7. Organize project files in folders. FOURTH
//		 7. Put project on GitHub and gh-pages. MUST!!! When I finish everything!
//		 8. Code review?
//		 9. Modify render with tenary operator just for BoxList component.