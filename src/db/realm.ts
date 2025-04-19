import Realm from 'realm';
import { CardSchema } from '../schemas/CardSchema';
let realm: Realm|null = null;
export async function getRealm() {
  if (!realm) realm = await Realm.open({ path: 'cards.realm', schema: [CardSchema] });
  return realm;
}
