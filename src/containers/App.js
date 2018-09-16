import React, { Component } from 'react';
import BookList from '../components/BookList';
import ModalComponent from '../components/ModalComponent';
import './App.css';

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
		this.setState({ showModal: !showModal, errors: {title: '', author: '', publishedDate: ''}});
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
			console.log('publishedDate', e.target.value);
				break;
			default:
				break;
		}
	}

	handleSubmit = (e) => {
		e.preventDefault();

		const bookToValidate = {
			title: this.state.title, 
			author: this.state.author, 
			publishedDate: this.state.publishedDate
		};
		const isBookValidated = this.validateForm(bookToValidate);
		if (isBookValidated) {
			let updatedBooks = this.state.books;

			if (this.state.id !== '') {
				const indexOfBookToEdit = this.state.books.findIndex(book => book.id === this.state.id);
				updatedBooks[indexOfBookToEdit].title = this.toProperTitle(this.state.title);
				updatedBooks[indexOfBookToEdit].author = this.state.author;
				updatedBooks[indexOfBookToEdit].publishedDate = this.state.publishedDate;
			} else {
				const IdOfNewBook = Math.floor(Math.random() * 100000).toString();
				const newBook = {
					id: IdOfNewBook, 
					title: this.toProperTitle(this.state.title),
					author: this.state.author,
					publishedDate: this.state.publishedDate
				};
				updatedBooks.unshift(newBook);
			}

			this.setState({ 
				books: updatedBooks,
				id: '', 
				title: '', 
				author: '', 
				publishedDate: ''
			});
			this.toggleModal();			
		}
	}

	validateForm = (bookToValidate) => {
		const updatedErrors = this.state.errors;
		let isFormValid;

		Object.keys(bookToValidate).forEach(elementKey => {
			const isBookElementHasValue = bookToValidate[elementKey].length;

			if (isBookElementHasValue) {
				switch(elementKey) {
					case 'title':
					const isTitleExists = this.state.books.some(book => book.title === bookToValidate.title);
					updatedErrors.title = isTitleExists ? 'Title already exists. Please pick a different name.' : '';
						break;
					case 'author':
					updatedErrors.author = '';
						break;
					case 'publishedDate':
					const pattern = /^([0][1-9]|[1|2][0-9]|[3][0|1])[./-]([0][1-9]|[1][0-2])[/-]([0][1-9]|[1|2][0-9]|[3][0|1])([0-9]{4})$/;
					const isDateNotValid = pattern.test(bookToValidate.publishedDate);
					updatedErrors.publishedDate = isDateNotValid ? 'Must enter a valid date in the following pattern YY-MM-DDDD' : '';
						break;
					default:
						break;
				}
			} else {
				switch(elementKey) {
					case 'title':
					updatedErrors.title = 'Title can not be empty.';
						break;
					case 'author':
					updatedErrors.author = 'Author can not be empty.';
						break;
					case 'publishedDate':
					updatedErrors.publishedDate = 'Published date can not be empty.';
						break;
					default:
						break;
				}
			}
		});

		isFormValid = Object.keys(updatedErrors).every(errorKey => updatedErrors[errorKey] === "");
		this.setState({ errors: updatedErrors, isFormValid: isFormValid });
		return isFormValid;
	}

	toProperTitle = (title) => {
			let properTitle = title
			try	{
			const pattern = /[^a-zA-Z ]/g;

			properTitle = properTitle.trim();
			properTitle = properTitle.replace(pattern, '');
			properTitle = properTitle.toLowerCase().split(' ')
				.map(word => word.replace(word[0], word[0].toUpperCase()))
				.join(' ');
			} catch(error) {
				console.log('toProperTitle-catch-error', 
					'An error has occured in toProperTitle function, check if input title contains more than one space between words');
			} finally {
			return properTitle;
			}
	}

	render() {
		const { books, title, author, publishedDate, errors, showModal } = this.state;

		return !books.length ? 
			(
				<div className='d-flex flex-column justify-content-center'>
					<h1 className='display-3 align-self-center m-3 font-custom'>No books yet...</h1>
					<h6 className='align-self-center m-3 font-custom'>
						Or... you just deleted all your books. Go ahead and add your first book now.
					</h6>
					<button type="button" className="btn btn-primary border-dark align-self-center m-3" onClick={this.handleAdd}>
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
				<div className='d-flex flex-column justify-content-center'>
					<h1 className='display-3 align-self-center m-3 font-custom'>Fully Booked!</h1>	
					<h6 className='align-self-center m-3 font-custom'>
						The application to manage your book collection.
					</h6>
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