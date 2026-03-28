import amplitude from 'amplitude-js';
import mixpanel from 'mixpanel-browser';

export function initAnalytics() {
	amplitude.getInstance().init(process.env.REACT_APP_AMPLITUDE_API_KEY);
	if (process.env.REACT_APP_MIXPANEL_TOKEN) {
		mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN, {
			track_pageview: 'url-with-path',
			record_sessions_percent: 100,
		});
	}
}

export function track(event, properties) {
	amplitude.getInstance().logEvent(event, properties);
	if (process.env.REACT_APP_MIXPANEL_TOKEN) {
		mixpanel.track(event, properties);
	}
}

export function identify(key, value) {
	const ampIdentify = new amplitude.Identify().set(key, value);
	amplitude.getInstance().identify(ampIdentify);
}

export function registerSuperProperties(properties) {
	if (process.env.REACT_APP_MIXPANEL_TOKEN) {
		mixpanel.register(properties);
	}
}
