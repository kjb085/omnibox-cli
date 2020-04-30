var gitlabRepo = {
    commits: {
        self: 'commits/',
        input: {
            count: 1,
            defaults: [''],
            suggestions: [['staging', 'master', 'kb/']]
        }
    },
    merge_requests: 'merge_requests/',
    compare: {
        self: 'merge_requests/new?utf8=✓&merge_request%5Bsource_branch%5D={1}&merge_request%5Btarget_branch%5D={2}',
        input: {
            count: 2,
            defaults: ['staging', 'master'],
            suggestions: [['kb/', 'staging'], ['staging', 'master']],
        }
    }
};

var keywordHierarchy = {
    abc: {
        self: 'https://www.google.com',
        replace: false,
        next: {
            def: '/test'
        }
    },
    test: 'www.bing.com',
    gitlab: {
        self: 'https://gitlab.dev.tripadvisor.com/cruise/',
        next: {
            php: {
                self: 'cruisecritic-php/',
                next: gitlabRepo
            },
            admin: {
                self: 'cc-admin-php/',
                next: gitlabRepo
            },
            images: {
                self: 'cc-images/',
                next: gitlabRepo
            },
            utils: {
                self: 'cc-utils/',
                next: gitlabRepo
            },
            docker: {
                self: 'cc-php7-docker/',
                next: gitlabRepo
            },
            'hipship-php': {
                self: 'cc-api-php/',
                next: gitlabRepo
            },
            'hipship-js': {
                self: 'cc-api-js/',
                next: gitlabRepo
            },
            messaging: {
                self: 'cc-messaging/',
                next: gitlabRepo
            },
            todo: 'dashboard/todos',
        },
    },
    r: {
        self: 'www.reddit.com/r/',
        // acceptsInput: true,
        input: {
            count: 1,
            suggestions: ['jailbreak', 'eagles', 'goldandblack']
        }
    },
    atp: {
        self: 'https://www.atptour.com/en/',
        next: {
            rankings: 'rankings/singles/',
            tournaments: 'tournaments',
        }
    },
    special: 'http://theweekdaycafe.com/menuPDF/TheWeekdayCafe-Ewing-Specials.pdf',
    jenkins: {
        self: 'http://jenkins.dev.cruisecritic.net/',
        next: {
            php: {
                self: 'job/cruisecritic-php/{1}',
                input: {
                    count: 1,
                    defaults: [''],
                    suggestions: ['kb/'],
                    mutations: [['encode']],
                    formats: ['job/{+}']
                }
            }
        }
    },
    "pto": "https://docs.tamg.io/display/FCC/Flights%2C+Cruise%2C+Car",
    "traffic": "https://www.google.com/maps/@40.2446906,-74.8084201,13.62z/data=!5m1!1e1",
};

if (true) {
    chrome.storage.sync.set({ keywordHierarchy: keywordHierarchy }, function () {
        console.log('set deafult');
    });
}