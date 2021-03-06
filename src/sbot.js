import pull from 'pull-stream'
pull.paraMap = require('pull-paramap')
const { isBlob } = require('ssb-ref')
var create = require('ssb-validate').create

function present (value) {
  return value != null
}

export default 
{
  // Add a new message to the log, signed with the postAs key
  post_as (ssb, postAs, content, cb) {
    ssb.getLatest(postAs.id, (err, data) => {
      var state = data ? {
        id: data.key,
        sequence: data.value.sequence,
        timestamp: data.value.timestamp,
        queue: []
      } : {id: null, sequence: null, timestamp: null, queue: []}
      
      ssb.add(
        create(state, postAs, null, content, Date.now()), function (err, message) {
          if(err)
            throw err
          if(cb)
            cb()
        }
      )
    })
  },

  // Get a live stream of all posts related to @dest
  related: function(sbot, dest, cb) {
    pull(
      sbot.backlinks.read({ 
        live: true,
        query: [{
          $filter: {
            dest,
            value: { content: { type: 'post' } }
            }
          }],
        }
      ),
      pull.filter(msg => !msg.sync),
      pull.drain(msg => {
        cb(null, msg)
      })
    )
  },

  // Get a live stream of all the votes related to @dest
  countStream: function (sbot, dest, cb) {
    pull(
      sbot.backlinks.read({ 
        live: true,
        query: [{
          $filter: {
            dest,
            value: { content: { type: 'vote', vote: { link: dest } } }
            }
          }],
        }
      ),
      pull.filter(msg => !msg.sync),
      pull.drain(msg => {
        cb(null, msg)
      })
    )
  },

  displayName (sbot, feedId, cb) {
    var data = {}

    const opts = {
        limit: 1,
        reverse: true,
        query: [
          {
            $filter: {
              value: {
                author: feedId,
                content: {
                  type: 'about',
                  about: feedId,
                  name: { $is: 'string' } // there's a name string present
                }
              },
              timestamp: { $gt: 0 } // a hack that forces ordering by timestamp
            }
          },
          {
            $map: {
              name: ['value', 'content', 'name']
            }
          }
        ]
      }

    pull(
        sbot.query.read(opts),
        pull.collect((err, results) => {
        if (err) {
          cb(err)
          return
        }

        var name
        if (!results || !results.length) name = feedId
        else name = results[0].name

        data.authorName = name
        
        cb(null, data)
      })
    )
  },

  avatar (sbot, feedId, cb) {
    const opts = {
      reverse: true,
      query: [
        {
          $filter: {
            value: {
              author: feedId,
              content: {
                type: 'about',
                about: feedId,
                image: { $truthy: true }
              },
              timestamp: { $gt: 0 } // a hack that forces ordering by timestamp
            }
          }
        },
        {
          $map: {
            image: ['value', 'content', 'image']
          }
        }
      ]
    }

    pull(
      sbot.query.read(opts),
      // hooray the format for image about is non-standardised... could be image.link or image that the blob link is stored under
      pull.map(data => typeof data.image === 'string'
        ? data.image
        : data.image.link
      ),
      pull.filter(link => isBlob(link)),
      pull.take(1),
      pull.collect((err, results) => {
        if (err) {
          cb(err)
          return
        }

        if (!results || !results.length) cb(null, null)
        else cb(null, results[0])
      })
    )
  }
}