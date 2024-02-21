import app from "../app.js";
import supertest from "supertest";

const request = supertest(app);

describe('Valid /weather request', () => {
  it('should show temperature of a requested city', async () => {
    const response = await request.post('/weather').send({ cityName: 'Berlin' });
    expect(response.statusCode).toBe(200);
    expect(response.body.weatherText).toContain( 'The temperature in Berlin' )
  });

  it('should advise user to enter city name', async () => {
    const response = await request.post('/weather').send({ cityName: '' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual('Please enter a city name');
  });

  it('should advice user to enter a valid city name', async () => {
    const response = await request.post('/weather').send({ cityName: 'xx' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toContain( 'Please enter a valid city name!' );
  });

  it('should respond with a 500 status code for internal server error)', async () => {
    const response = await request.post('/weather').send({ cityName: 'London' });
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toEqual( 'Internal Server Error' );
  });
});