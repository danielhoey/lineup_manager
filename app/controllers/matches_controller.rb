class MatchesController < ApplicationController
  def index
    @matches = Match.all
  end

  def create
    m = Match.create(params[:match].permit(:round, :opponent))
    render :json => m
  end

  def show
    if params[:round]
      @match = Match.where(round: params[:round]).first
      @quarter = if params[:quarter] then params[:quarter].to_i else 1 end
    else
      @match = Match.where(id: params[:id]).first
      @quarter = 1
    end
    raise ActiveRecord::RecordNotFound.new("Round #{params[:round]} not found") if @match.nil?

    @players = Player.active.select('id, first_name, last_name, number')

    @lineup = nil
    i = 1
    while @lineup.blank? && @quarter - i > -1
      @lineup = @match.lineup[@quarter-i]
      i += 1
    end
  end

  def update
    m = Match.where(id: params[:id]).first
    if m.lineup.blank?
      m.lineup =  Array.new(4)
    end
    params[:quarters].each do |q|
      m.lineup[q-1] = params[:lineup]
    end
    m.save
    render :json => m
  end

  def destroy
    Match.delete(params[:id])
    render :json => params
  end
end