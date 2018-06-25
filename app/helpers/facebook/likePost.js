import config from 'config';
import 'isomorphic-fetch';

const likePost = (post_id) => {
  console.log('no no no no no no no no!');
  fetch('https://graph.facebook.com/v3.0/' + post_id + '/likes?access_token=' + config.publish_pages_token, {
    headers: {
      'content-type': 'application/json'
    },
    method: "POST"
  })
  .then(res => res.json())
  .then(response => {
    console.log(response);
    console.log('Megatron liked post:', post_id)
  })
  .catch(err => console.error(err));
};

export default likePost;