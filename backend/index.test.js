const axios = require('axios')

const BASE_URL = 'http://localhost:3000/api'

describe('Authentication', ()=>{
    
    test('user is able to signup only once', async()=>{

        const {email, password, response} = await signup()
        
        expect(response.status).toBe(200)
        expect(response.data).toHaveProperty('token')
        expect(response.data.token).toBeDefined()

        try {
            const updatedResponse = await axios.post(`${BASE_URL}/auth/register`, {
                email,
                password,
                name: 'test'
            })
            
        } catch (error) {
            expect(error.response.status).toBe(400)
            expect(error.response.data).toHaveProperty('message')
            expect(error.response.data.message).toBe("Username Already Exists!")
            
        }

    })

    test('Signup request fails if the email is empty', async()=>{
        const password = '123123'

        try {
            const response = await axios.post(`${BASE_URL}/auth/register`, {
                password,
                name: 'test'
            })
        } catch (error) {
            
            expect(error.response.status).toBe(400)
            expect(error.response.data.message).toBe("Validation Failed")
        }

    })

    test('Signin succeeds if email and password are correct', async()=>{
                
        const {email, password} = await signup()

        const response = await axios.post(`${BASE_URL}/auth/login`, {
            email,
            password
        })

        expect(response.status).toBe(200)
        expect(response.data).toHaveProperty('token')
        expect(response.data.token).toBeDefined()

    })

    test('Signin fails if email or password is incorrect', async()=>{
        const password = '123123'
        const email = "doesntexistemail@test.com"
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, {
                email,
                password,
                name: 'test'
            })
        } catch (error) {
            
            expect(error.response.status).toBe(404)
            expect(error.response.data.message).toBe("User not found")
        }

    })
})

describe('Purchase and Restock (Inventory)', ()=>{
    let adminToken = ''
    let userToken = ''
    //will run before tests
    beforeAll(async() => {
        const admin = await axios.post(`${BASE_URL}/auth/login`,{
            email: 'admin@test.com',
            password: 'admin123'
        })
        adminToken = admin.data.token

        const {email, response: user} = await signup()
        userToken = user.data.token
    });

    test('User is able to purchase if enough stock is available', async()=>{
        const response = await axios.post(`${BASE_URL}/sweets/:id/purchase`, 
            {quantity: 2},
            {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                }
            }
        )

        expect(response.status).toBe(200)
        expect(response.data).toHaveProperty('message')
        expect(response.data.message).toBe("Purchase successful")
    })

    test('User is not able to purchase if not enough stock is available', async()=>{
        try {
            const response = await axios.post(`${BASE_URL}/sweets/:id/purchase`, 
                {quantity: 2000},
                {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
        } catch (error) {
            expect(error.response.status).toBe(400)
            expect(error.response.data).toHaveProperty('message')
            expect(error.response.data.message).toBe("Not enough stock available")
        }
    })

    test("Admin is able to restock", async()=>{
        const response = await axios.post(`${BASE_URL}/sweets/:id/restock`, 
            {quantity: 20},
            {
                headers: {
                    "Authorization": `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                }
            }
        )

        expect(response.status).toBe(200)
        expect(response.data).toHaveProperty('message')
        expect(response.data.message).toBe("Restock successful")
    })
})


async function signup(){
    const email = 'test' + Math.random() + '@test.com'
    const password = '123123'

    const response = await axios.post(`${BASE_URL}/auth/register`, {
        email,
        password,
        name: 'test'
    })

    return {email, password, response}
}