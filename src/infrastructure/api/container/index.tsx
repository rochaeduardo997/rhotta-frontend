import { Container } from 'inversify';
import { HttpClient } from '@src/infrastructure/api/index';

const container: Container = new Container();

container.bind(HttpClient).toSelf();

export default container;
