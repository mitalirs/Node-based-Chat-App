
const socket = io()

//Elements
const $messageForm = document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')

const $sendLocationButton = document.querySelector('#send-location')

//Template for text messages
const $messages = document.querySelector('#messages') 
const messageTemplate = document.querySelector('#message-template').innerHTML

// template for url
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true }) 


const autoscroll = ()=>{ 
    const $newMessage = $messages.lastElementChild   
    
    // getting ht of the new msg
    const newMessageStyles = getComputedStyle($newMessage) 
    const newMessageMargin = parseInt(newMessageStyles.marginBottom) 
    console.log(newMessageMargin)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    const visibleHeight = $messages.offsetHeight
    
    //ht of msgs container
    const containerHeight = $messages.scrollHeight

    //how far have i scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){ 
        $messages.scrollTop = $messages.scrollHeight
    }

}

socket.on("locationMessage", (message)=>{ 
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username, 
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a') 
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})


socket.on('message', (m)=>{
    console.log(m)
    
    const html = Mustache.render(messageTemplate, { 
        message: m.text,  
        createdAt: moment(m.createdAt).format('h:mm a') 
    }) 
    $messages.insertAdjacentHTML('beforeend', html)

    autoscroll() 
})
socket.on('roomData', ({room, users})=>{ 
    const html = Mustache.render(sidebarTemplate, {  
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html >
})

$messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled') 


    const message = e.target.elements.message.value =
    socket.emit('sendMessage', message, (error)=>{ 
        $messageFormButton.removeAttribute('disabled') 
        
        $messageFormInput.value='' 
        $messageFormInput.focus()  
        
        if(error){
            return console.log(error)
        }
        console.log('Message delivered!')
    })

})

//10
$sendLocationButton.addEventListener('click', ()=>{
    if(!navigator.geolocation){ //if browsers(old ones mostly) don't show support geolocation api
        return alert('Geolocation is not supported by your browser')
    }
    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position)=>{  

        const coordinates = {latitude: position.coords.latitude,  longitude:position.coords.longitude}
        socket.emit('sendLocation', {coordinates}, ()=>{ 
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')
        }) 
        

    }) 
})

socket.emit('join', {username, room}, (error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
}) 


