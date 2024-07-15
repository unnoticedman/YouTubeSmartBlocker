chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        addRules: [
            {
                id: 1,
                priority: 1,
                action: { type: 'block' },
                condition: {
                    urlFilter: '*://*.googlevideo.com/*ad*',
                    resourceTypes: ['xmlhttprequest', 'sub_frame', 'script']
                }
            },
            {
                id: 2,
                priority: 1,
                action: { type: 'block' },
                condition: {
                    urlFilter: '*://*.youtube.com/api/stats/ads*',
                    resourceTypes: ['xmlhttprequest', 'sub_frame', 'script']
                }
            },
            {
                id: 3,
                priority: 1,
                action: { type: 'block' },
                condition: {
                    urlFilter: '*://*.youtube.com/ads*',
                    resourceTypes: ['xmlhttprequest', 'sub_frame', 'script']
                }
            },
            {
                id: 4,
                priority: 1,
                action: { type: 'block' },
                condition: {
                    urlFilter: '*://*.doubleclick.net/*',
                    resourceTypes: ['xmlhttprequest', 'sub_frame', 'script']
                }
            },
            {
                id: 5,
                priority: 1,
                action: { type: 'block' },
                condition: {
                    urlFilter: '*://*.youtube.com/get_video_info?*adformat*',
                    resourceTypes: ['xmlhttprequest', 'sub_frame', 'script']
                }
            },
            {
                id: 6,
                priority: 1,
                action: { type: 'block' },
                condition: {
                    urlFilter: '*://*.youtube.com/pagead/*',
                    resourceTypes: ['xmlhttprequest', 'sub_frame', 'script']
                }
            },
            {
                id: 7,
                priority: 1,
                action: { type: 'block' },
                condition: {
                    urlFilter: '*://*.youtube.com/ptracking*',
                    resourceTypes: ['xmlhttprequest', 'sub_frame', 'script']
                }
            },
            {
                id: 8,
                priority: 1,
                action: { type: 'block' },
                condition: {
                    urlFilter: '*://*.youtube.com/watch?*ad*',
                    resourceTypes: ['xmlhttprequest', 'sub_frame', 'script']
                }
            },
            {
                id: 9,
                priority: 1,
                action: { type: 'block' },
                condition: {
                    urlFilter: '*://*.google.com/pagead/*',
                    resourceTypes: ['xmlhttprequest', 'sub_frame', 'script']
                }
            },
            {
                id: 10,
                priority: 1,
                action: { type: 'block' },
                condition: {
                    urlFilter: '*://*.youtube.com/youtubei/v1/ad*',
                    resourceTypes: ['xmlhttprequest', 'sub_frame', 'script']
                }
            },
            {
                id: 11,
                priority: 1,
                action: { type: 'block' },
                condition: {
                    urlFilter: '*://*.youtube.com/api/ads*',
                    resourceTypes: ['xmlhttprequest', 'sub_frame', 'script']
                }
            },
            {
                id: 12,
                priority: 1,
                action: { type: 'block' },
                condition: {
                    urlFilter: '*://*.youtube.com/youtubei/v1/next?*ad*',
                    resourceTypes: ['xmlhttprequest', 'sub_frame', 'script']
                }
            }
        ]
    });
});
