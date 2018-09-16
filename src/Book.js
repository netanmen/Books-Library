import React from 'react';
import './Book.css';

const Book = ({ id, thumbnail, author, publishedDate, title, handleEdit,handleDelete, toggleModal }) => {
	return (
		<div className="book-container card m-3 p-0 w-auto enlarge border border-dark" 
			style={{minWidth: '13rem', maxWidth: '13rem', minHeight: '17rem'}}>
			<div className="card-body d-flex flex-column">
				<h5 className="font-weight-bold">{title}</h5>
				<div className='mt-auto'>
					<p className="font-italic">{author}</p>
					<p className="font-weight-light">{publishedDate}</p>
					<button type='button' onClick={handleEdit} value={id} className="btn btn-outline-primary btn-sm btn-custom" style={{marginRight: '.35rem'}}>
						Edit				
					</button>
					<button type='button' onClick={handleDelete} value={id} className="btn btn-outline-danger btn-sm btn-custom">Delete</button>
				</div>
			</div>	
		</div>
	);	
}

export default Book;
