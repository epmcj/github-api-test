// github token = 1fc1ee02fece6bd9c8967fdd559ca3300d131b6b
const util = require ('util');
const https = require ('https');
const express = require ('express');

// MUST HANDLE ERRORS
// + PRESENT DATA

function getUserInfo (login) {
    return new Promise ( (resolve, reject) => {
        var userReq = {
            'host': 'api.github.com',
            'path': `/users/${login}`,
            'method': 'GET',
            'headers': {
                'User-Agent': 'epmcj',
                'Authorization': 'token 1fc1ee02fece6bd9c8967fdd559ca3300d131b6b'
            }
        };
        
        https.get (userReq, (res) => {
            // console.log ('status: ', res.statusCode);
            // console.log ('headers: ', JSON.stringify (res.headers));
            
            let data = '';
            
            res.on ('data', (chunk) => {
                data += chunk;
            });
            
            res.on ('end', () => {
                try {
                    let userRcvd = JSON.parse (data);
                    return resolve ({
                        'login': userRcvd.login,
                        'email': userRcvd.email,
                        'location': userRcvd.location,
                        'follows': userRcvd.following,
                        'followers': userRcvd.followers,
                        'public_repos': userRcvd.public_repos
                    });
                } catch (err) {
                    reject (new Error (data));
                }
            });
                    
        }).on ('error', (err) => {
            reject (err);
        });
    });

}

const getUserPublicReposAsync = util.promisify (getUserPublicRepos);
function getUserPublicRepos (login, callback) {
    var reposReq = {
        'host': 'api.github.com',
        'path': `/users/${login}/repos`,
        'method': 'GET',
        'headers': {
            'User-Agent': 'epmcj',
            'Authorization': 'token 1fc1ee02fece6bd9c8967fdd559ca3300d131b6b'
        }
    };
    
    https.get (reposReq, (res) => {
        let data = '';
        
        res.on ('data', (chunk) => {
            data += chunk;
        });
        
        res.on ('end', () => {
            try {
                let repos = JSON.parse (data);
                repos = repos.map ( (repo) => {
                    return repo.name;
                });
                return callback (null, repos);
            } catch (err) {
                return callback (
                    `Failed to get ${login} public repos.`, 
                    err
                );
            }
        });
            
    }).on ('error', (err) => {
        console.log ('Error: ', err.message);
    })    
}
    
    
async function consultGitHub (user_login) {
    return new Promise ( async (resolve, reject) => {
        try {
            const result = await Promise.all ([
                getUserInfo (user_login),
                getUserPublicReposAsync (user_login)
            ]);
            // console.log ("user_info: ", result[0]);
            user = {
                'info': result[0],
                'public_repositories': result[1]
            };
            return resolve (user);
            // console.log (user);
        } catch (err) {
            console.log ("Failed to consult data: ", err);
            return reject (err);
        }
    });
}

const app  = express ();
const port = 3000;
app.set ('view engine', 'jade');

// app.all ('/user/*', (req, res, next) => {
//     console.log ("Requesting: ", req.url);
//     next ();
// })

app.get ('/user/:login', (req, res) => {
    let login = req.params.login;
    console.log (`login=${login}`);
    // var user = {
    //     'info': {
    //         'login': '[login]',
    //         'email': '[email]',
    //         'location': '[location]',
    //         'follows': '[following]',
    //         'followers': '[followers]',
    //         'public_repos': '[public_repos]'
    //     },
    //     'public_repositories': ['repos[0]', 'repos[1]', 'repos[2]']
    // };
    // res.render ('user', {
    //     'title': login, 
    //     'user': user // JSON.stringify (user)
    // });
    if (login) {
        consultGitHub (login).then ((user) => {
            res.render ('user', {
                'title': login, 
                'user': user // JSON.stringify (user)
            });
        })
        .catch ((error) => {
            res.render ('index', {
                'title':'Ops!',
                'message': "User not found!"
            });
        });
    } else {
        res.render ('index', {
            'title': 'Hello!',
            'message': "Welcome to my GitHub API test!"
        });
    }
});

app.listen (port, () => {
    console.log (`Listening on port ${port}`);
});