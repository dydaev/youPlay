import * as React from 'react';

import './style.scss';

type propsTypes = {
    invert?: boolean,
    color?: string,
    filling: number,
    height?: string | number | undefined
}

const ProgressLine = ({color='black', filling, height, invert = false}: propsTypes) => {
    const styles = !invert
        ? {
            ...color ? { background: color } : {},
            ...filling ? { width: `${filling}%` } : {},
            ...height ? { height: (typeof height === 'number' ? height : `${filling}%`) }: {}
        } : {
            right: 0,
            ...color ? { background: color } : {},
            ...filling ? { width: `${100 - filling}%` } : {},
            ...height ? { height: (typeof height === 'number' ? height : `${filling}%`) }: {}
        }
	return <div style={styles} className="base-component_progress-line"/>;
};

export default ProgressLine;