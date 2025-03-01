import { useEffect, useRef } from 'react';

const useEffectSkipFirstRender = (func: () => void, deps: React.DependencyList) => {
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