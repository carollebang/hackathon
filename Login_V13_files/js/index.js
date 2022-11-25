window.addEventListener("load", ()=>{
    this.location.href=this.location.href+'#';

    const app =$("#app");
    let userId;
    let userEmail;

    const defaultTemplate = Handlebars.compile($('#default-template').html());
    const expensesTemplate = Handlebars.compile($('#expenses-template').html());
      const router = new Router({
             mode:'hash',
            root:'index.html',
            page404: (path) => {
              const html = defaultTemplate();
              app.html(html);
             login();

            }
          });

           router.addUriListener();
                $('a').on('click', (event) => {
                    event.preventDefault();
                    const target = $(event.target);
                    const href = target.attr('href');
                    const path = href.substring(href.lastIndexOf('/'));
                    router.navigateTo(path);
                  });
              router.navigateTo('/');

            router.add('/expenses', async () => {
              html = expensesTemplate();
              app.html(html);
              expenses();
               });


     function login(){
     const loginButton = document.getElementById('submit');
     loginButton.addEventListener('click',(event) => {
     event.preventDefault();

      const email = document.getElementById('email').value;
       const options = {
                 method: 'POST',
                body:JSON.stringify({email: email})

               };
       fetch('http://localhost:5050/people', options)
       .then(response =>response.json())
       .then(data =>{
       userId=data.id;
       userEmail=data.email;
       this.location.href=this.location.href+'expenses'

       } )
     })

     }

     function expenses(){
      const options = {
                  method: 'GET',
               }
        fetch(`http://localhost:5050/expenses/person/${userId}`,options)
        .then(response => response.json())
        .then(data=>{
         const expenses =[]
         let total=0;
         for(let expense of data) {
         total += expense.nettAmount;
         expenses.push({'expense':expense})
         }
          console.log(total);
          data = {
            email: userEmail,
            expenses:expenses,
            total:total


            }
          const template = document.getElementById('expenses-template').innerText;
            const compiledFunction = Handlebars.compile(template);
            document.getElementById('app').innerHTML = compiledFunction(data);
         })
     }

    })
