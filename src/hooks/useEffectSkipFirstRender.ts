import { useEffect, useRef } from 'react';

const useEffectSkipFirstRender = (func: Function, deps: Array<any>) => {
    const firstRender = useRef(true);

    useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			return;
		} else {
			func();
		}
    }, deps);
}

export default useEffectSkipFirstRender;