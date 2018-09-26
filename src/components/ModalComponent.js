import React from 'react';
import { Modal, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';

const ModalComponent = ({ title, author, publishedDate, handleChange, handleConfirmDelete, handleSubmit, errors, isFormValid, 
		toggleModal, showModal, modalType, className }) => {
	return (
		<Modal isOpen={showModal} toggle={toggleModal} className={className}>
			<Form onSubmit={handleSubmit}>
				<ModalBody>
					{
						(modalType === 'delete') ?
			            <Label>Are you sure you want to delete book?</Label> :
			            (
			            	<div>
					            <FormGroup>
						            <Label>Title</Label>
						            <Input invalid={errors.title.length ? true : false} 
						            	name="title" value={title} onChange={handleChange}/>
						            <FormFeedback>{errors.title}</FormFeedback>
					        	</FormGroup>
					        	<FormGroup>
						            <Label>Author</Label>
						            <Input invalid={errors.author.length ? true : false} 
						            	name="author" value={author} onChange={handleChange}/>
						            <FormFeedback>{errors.author}</FormFeedback>
					        	</FormGroup>
					        	<FormGroup>
						            <Label>Published Date</Label>
						            <Input invalid={errors.publishedDate.length ? true : false} 
						            	type="date" name="publishedDate" value={publishedDate} onChange={handleChange}/>
						            <FormFeedback>{errors.publishedDate}</FormFeedback>
					        	</FormGroup>
				        	</div>
			        	)

					}
				</ModalBody>
				<ModalFooter>
					<button type="button" className="btn btn-secondary" onClick={toggleModal}>Cancel</button>
					{
						modalType === 'delete' ?
							<button type="button" className="btn btn-primary" onClick={handleConfirmDelete}>
								Confirm
							</button> :
	   		       			<input type="submit" value='Save Changes' className="btn btn-primary"/>
					}
				</ModalFooter>
		    </Form>
		</Modal>
	);
}

export default ModalComponent;

