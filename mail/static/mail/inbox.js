document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  
  // Select form and sends POST request
  document.querySelector('#compose-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const fieldTo = document.querySelector('#compose-recipients').value;
    const fieldSubject = document.querySelector('#compose-subject').value;
    const fieldBody = document.querySelector('#compose-body').value;
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: `${fieldTo}`,
          subject: `${fieldSubject}`,
          body: `${fieldBody}`
      })
    })
    .then(response => response.json())
    .then(response => {
      // Print result
      console.log(response);
  })
    // Catch any errors and log them to the console
    .catch(error => {
      console.log('Error: ', error)
    });
    load_mailbox('sent')
  });
}   


function load_mailbox(mailbox) {
  fetch(`emails/${mailbox}`)
  .then(response => response.json())
  .then(response => {
    console.log(response);
    response.forEach(show_emails);

  })
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

}

function show_emails(dados){
  console.log(dados.sender);

  // Create variables and store email data
  const sender = dados.sender;
  const subject = dados.subject;
  const timestamp = dados.timestamp;
  const id = dados.id;
  // Create div for email
  const each_div = document.createElement('div');
  const each_post = document.createElement('a');
  each_post.setAttribute('href', `/emails/${id}`)
  each_post.className = 'each_post';
  each_post.innerHTML = `Sender: ${sender} Subject: (${subject}) Timestamp:${timestamp}`;
  each_div.appendChild(each_post);
  
  // Add div to DOM
  document.querySelector('#emails-view').append(each_div);
  

  //View email
  // document.querySelectorAll('.each_post').addEventListener('click', compose_email)
}

