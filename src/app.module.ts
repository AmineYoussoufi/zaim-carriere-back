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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LcnModule } from './lcn/lcn.module';
import { PaymentModule } from './payment/payment.module';
import { ReportsModule } from './reports/reports.module';
import { VidangeModule } from './vidange/vidange.module';
import { ProductionModule } from './production/production.module';
import { DevisModule } from './devis/devis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes the ConfigModule available globally
      envFilePath: '.env', // specify the path to your .env file
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
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
    LcnModule,
    PaymentModule,
    ReportsModule,
    VidangeModule,
    ProductionModule,
    DevisModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
