import * as React from 'react';

export type props = {
	children: any;
};

const Tabs = ({ children }: props) => {
	console.log(children);
	return (
		<section>
			{children.map((Child: any, index: number) => (
				<div key={'tabstap'+index.toString()}>
					<Child />
				</div>
			))}
		</section>
	);
};

export default Tabs;
