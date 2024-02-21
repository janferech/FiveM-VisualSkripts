--Leaked by discord.gg/suckleaks
Config = {}

Config.Notify = function(source, color, title, message)
    if color == "red" then 
        color = "error"
    end

    if color == "green" then 
        color = "success"
    end
    
    TriggerClientEvent('ws_notify', source, color, title, message,5000)
end