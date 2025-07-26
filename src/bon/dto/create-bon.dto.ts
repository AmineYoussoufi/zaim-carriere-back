import { Client } from './../../client/entities/client.entity';
import { Vehicule } from './../../vehicule/entities/vehicule.entity';
export class CreateBonDto {
  public date: string;
  public numero: string;
  public jour: number;
  public mois: number;
  public annee: number;
  public montant: number;
  public vehicule: Vehicule;
  public client: Client;
}
