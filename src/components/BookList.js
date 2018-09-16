import React from 'react';
import Book from './Book';

const BookList = ({ books, handleEdit, handleDelete, toggleModal }) => {
	return (
		<div className='card-deck d-flex flex-wrap justify-content-center'>
			{books.map(book => 
				<Book key={book.id} 
					id={book.id} 
					title={book.title}
					author={book.author} 
					publishedDate={book.publishedDate}
					handleEdit={handleEdit}
					handleDelete={handleDelete}
					toggleModal={toggleModal}
				/> 
			)}
		</div>
	);
}

export default BookList;
