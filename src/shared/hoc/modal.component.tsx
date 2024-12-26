import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { IoClose } from 'react-icons/io5';

interface ModalProps {
	title?: string;
	children: ReactNode;
	onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => {
	return ReactDOM.createPortal(
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white dark:bg-gray-900 w-[90%] max-w-lg rounded-lg shadow-lg p-5 relative">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl ">{title}</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 focus:outline-none"
						aria-label="Close Modal"
					>
						<IoClose />
					</button>
				</div>
				<div className="modal-body">{children}</div>
			</div>
		</div>,
		document.body
	);
};

export default Modal;
