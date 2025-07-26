import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth/auth.controller';
import { ClientModule } from './client/client.module';
import { UserModule } from './user/user.module';
import { BonModule } from './bon/bon.module';
import { AuthModule } from './auth/auth.module';
import { PermissionModule } from './permission/permission.module';
import { ProduitModule } from './produit/produit.module';
import { VehiculeModule } from './vehicule/vehicule.module';
import { CheckModule } from './check/check.module';
import { DepotModule } from './depot/depot.module';
import { ChargeModule } from './charge/charge.module';
import { EntreeModule } from './entree/entree.module';
import { CaisseModule } from './caisse/caisse.module';
import { SalarieModule } from './salarie/salarie.module';
import { SalaireModule } from './salaire/salaire.module';
import { PieceDeRechangeModule } from './piece-de-rechange/piece-de-rechange.module';
import { CarburantModule } from './carburant/carburant.module';
import { BonChargeModule } from './bon-charge/bon-charge.module';
import { FournisseurModule } from './fournisseur/fournisseur.module';
import { StockModule } from './stock/stock.module';
import { StockOperationModule } from './stock-operation/stock-operation.module';
import { MachineModule } from './machine/machine.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: 'zaim_user',
        password: 'BqxW1Fw1Vfm6BCc',
        database: 'zaim_db',
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    ClientModule,
    UserModule,
    BonModule,
    AuthModule,
    PermissionModule,
    ProduitModule,
    VehiculeModule,
    CheckModule,
    DepotModule,
    ChargeModule,
    EntreeModule,
    CaisseModule,
    SalarieModule,
    SalaireModule,
    PieceDeRechangeModule,
    CarburantModule,
    BonChargeModule,
    FournisseurModule,
    StockModule,
    StockOperationModule,
    MachineModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
