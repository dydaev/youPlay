import * as React from 'react';

import './style.scss';

export type props = {
	children: any;
};

const Tabs = ({ children }: props) => {
	const [selectedField, setSelectedField] = React.useState<number>(Array.isArray(children) && children.length ? 0 : 0);
	
	return (
		<div className="base-component_tab">
			<ul>
				{children &&
					children.map((Child: any, index: number) => {
						return (
							<li key={'tabstap' + index.toString()} className="base-component_tab-field">
								<button
									style={{ borderBottom: index === selectedField ? '1px solid white' : null }}
									onClick={(): void => setSelectedField(index)}
								>
									{Child.props.title ? Child.props.title : index}
								</button>
							</li>
						);
					})}
			</ul>
			<div className="base-component_tab__tab">{children[selectedField]}</div>
		</div>
	);
};

export default Tabs;
