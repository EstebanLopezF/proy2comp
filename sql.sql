use componentes;
go


CREATE TABLE servicio (
	id int primary key identity,
	nombre VARCHAR(25),
	telefono VARCHAR(25),
	correo_electronico VARCHAR(25),
	contacto VARCHAR(25),
	tipo VARCHAR(25),
	descripcion VARCHAR(255)
);


create procedure RET_ALL_SERVICIO_SP
as
	select id,nombre,telefono,correo_electronico,contacto,tipo,descripcion
	from servicio


create Procedure CRE_SERVICIO_SP
		@P_nombre VARCHAR(25),
		@P_telefono varchar(25),
		@P_correo_electronico varchar(25),
		@P_contacto varchar(25),
		@P_tipo VARCHAR(25),
		@P_descripcion VARCHAR(255)
As	
Begin Try
	Begin Transaction
		Insert Into servicio(nombre,telefono,correo_electronico,contacto,tipo,descripcion)
		values(@P_nombre, @P_telefono, @P_correo_electronico, @P_contacto, @P_tipo, @P_descripcion)
	Commit
End try

Begin Catch
	Print 'Error al insertar nuevo Servicio' + @P_nombre
	ROLLBACK
End Catch
